import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';
import { jwtDecode } from 'jwt-decode';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import {
  AmoFileClientOptions,
  SessionParams,
  SessionResponse,
  UploadResult,
  PartInfo,
  JwtPayload
} from './interfaces';

export class AmoFileClient {
  private driveUrl: string;
  private instance: AxiosInstance;
  private accessToken: string;
  private debug: boolean;

  constructor(accessToken: string, options: AmoFileClientOptions = {}) {
    this.driveUrl = options.driveUrl || 'https://drive-b.amocrm.ru';
    this.debug = options.debug || false;

    if (!accessToken) {
      throw new Error('ERROR_NO_ACCESSTOKEN');
    }
    this.accessToken = accessToken;

    this.instance = axios.create({
      baseURL: this.driveUrl,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      timeout: options.timeout || 10000,
    });
    
    if (this.debug) {
      const config = {
        prefixText: 'AmoFileClient',
        headers: false,
        params: true,
      };
      this.instance.interceptors.request.use((request) => {
        return requestLogger(request, config);
      });
      this.instance.interceptors.response.use((response) => {
        return responseLogger(response, config);
      });
    }
  }

  async getFiles(): Promise<any> {
    try {
      const url = `/v1.0/files`;
      const response: AxiosResponse = await this.instance.get(url);
      return response.data;
    } catch (error) {
      if (this.debug) {
        console.error('Error getting files:', error);
      }
      throw error;
    }
  }

  private hasScope(scope: string): boolean {
    try {
      const jwtObject = jwtDecode<JwtPayload>(this.accessToken);
      const scopes = jwtObject.scopes || [];
      return scopes.includes(scope);
    } catch (error) {
      if (this.debug) {
        console.error('Error decoding JWT token:', error);
      }
      return false;
    }
  }

  hasFilesScope(): boolean {
    return this.hasScope('files');
  }

  hasFilesDeleteScope(): boolean {
    return this.hasScope('files_delete');
  }

  async getFileByUUID(uuid: string): Promise<any> {
    try {
      const url = `/v1.0/files/${uuid}`;
      const response: AxiosResponse = await this.instance.get(url);
      return response.data;
    } catch (error) {
      if (this.debug) {
        console.error(`Error getting file by UUID ${uuid}:`, error);
      }
      throw error;
    }
  }

  async restoreFileByUUID(uuid: string): Promise<any> {
    try {
      const url = `/v1.0/files/restore`;
      const response: AxiosResponse = await this.instance.post(url, [{ uuid }]);
      return response.data;
    } catch (error) {
      if (this.debug) {
        console.error(`Error restoring file by UUID ${uuid}:`, error);
      }
      throw error;
    }
  }

  /*
  async deleteFileByUUID(uuid: string): Promise<any> {
    try {
      const url = `/v1.0/files`;
      // http spec: delete method have not payload
      const response: AxiosResponse = await this.instance.delete(url, { data: [{ uuid }] });
      return response.data;
    } catch (error) {
      if (this.debug) {
        console.error(`Error deleting file by UUID ${uuid}:`, error);
      }
      throw error;
    }
  }
  */

  private async createSession(params: SessionParams): Promise<SessionResponse> {
    try {
      const url = '/v1.0/sessions';

      const data = {
        file_name: params.fileName,
        file_size: params.fileSize,
        content_type: params.contentType,
        with_preview: true,
      };
      const response: AxiosResponse<SessionResponse> = await this.instance.post(url, data);
      return response.data;
    } catch (error) {
      if (this.debug) {
        console.error('Error creating session:', error);
      }
      throw error;
    }
  }

  private async uploadFilePart(uploadUrl: string, data: fs.ReadStream): Promise<UploadResult> {
    try {
      const response: AxiosResponse<UploadResult> = await this.instance.post(uploadUrl, data);
      return response.data;
    } catch (error) {
      if (this.debug) {
        console.error('Error uploading file part:', error);
      }
      throw error;
    }
  }

  private async getPartsMap(filePath: string, splitSize: number): Promise<PartInfo[]> {
    try {
      const totalFileSize = await this.getTotalFileSize(filePath);
      const partsCount = Math.ceil(totalFileSize / splitSize);
    
      if (this.debug) console.log({ totalFileSize, partsCount });
      
      const parts: PartInfo[] = [];
      for (let i = 0; i < partsCount; i++) {
        const isLast = i + 1 === partsCount;
        parts.push({
          index: i, 
          start: i * splitSize, 
          end: isLast ? totalFileSize - 1 : (i + 1) * splitSize - 1,
          isLast
        });
      }
    
      if (this.debug) console.table(parts);
      return parts;
    } catch (error) {
      if (this.debug) {
        console.error('Error creating parts map:', error);
      }
      throw error;
    }
  }
  
  private async getTotalFileSize(filePath: string): Promise<number> {
    try {
      const stat = await fsPromises.stat(filePath);
      return stat.size;
    } catch (error) {
      if (this.debug) {
        console.error(`Error getting file size for ${filePath}:`, error);
      }
      throw error;
    }
  }

  private async checkFileExists(filePath: string): Promise<void> {
    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }
  }
  
  async uploadFile(fileName: string, filePath: string, contentType: string): Promise<UploadResult> {
    try {
      if (this.debug) console.log('uploadFile', { fileName, filePath, contentType });
      
      // Проверяем существование файла
      await this.checkFileExists(filePath);
      
      const splitSize = 128 * 1024;   // max 128 kb
      const partsMap = await this.getPartsMap(filePath, splitSize);
      
      // создаем сессию
      const data: SessionParams = {
        fileSize: await this.getTotalFileSize(filePath),
        fileName,
        contentType,
      };
      
      const session = await this.createSession(data);
      if (this.debug) console.log('session', JSON.stringify(session, null, 2));

      let uploadUrl = session.upload_url;
      let lastResult: UploadResult | undefined;

      for (const part of partsMap) {
        const data = fs.createReadStream(filePath, {
          encoding: null,
          start: part.start,
          end: part.end,
        });
        
        const result = await this.uploadFilePart(uploadUrl, data);
        uploadUrl = result.next_url || uploadUrl;
        
        if (part.isLast) {
          lastResult = result;
        }
      }

      if (!lastResult) {
        throw new Error('Upload failed: no result received');
      }

      return lastResult;
    } catch (error) {
      if (this.debug) {
        console.error('Error uploading file:', error);
      }
      throw error;
    }
  }
}

