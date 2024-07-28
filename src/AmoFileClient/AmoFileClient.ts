import axios, { AxiosInstance } from 'axios';
import {requestLogger,responseLogger} from 'axios-logger';
import {jwtDecode} from 'jwt-decode'
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';

export class AmoFileClient {
  driveUrl: string;
  instance: AxiosInstance;
  accessToken: string;

  constructor(accessToken: string, options: any) {
    this.driveUrl = options.driveUrl ? options.driveUrl : 'https://drive-b.amocrm.ru';

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
    
    if (options?.debug) {
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

  async getFiles () {
    const url = `/v1.0/files`;
    const response = await this.instance.get(url);
    return response.data;
  }

  private hasScope (scope: string) {
    const jwtObject = jwtDecode(this.accessToken) as any;
    const scopes = jwtObject.scopes;
    return scopes.find((el: string) => el === scope) ? true : false;
  }

  hasFilesScope () {
    return this.hasScope('files');
  }

  hasFilesDeleteScope () {
    return this.hasScope('files_delete');
  }

  async getFileByUUID (uuid: string) {
    const url = `/v1.0/files/${uuid}`;
    const response = await this.instance.get(url);
    return response.data;
  }

  async createSession(params: any) {
    const url = '/v1.0/sessions';

    const data = {
      file_name: params.fileName,
      file_size: params.fileSize,
      content_type: params.contentType,
      with_preview: true,
    }
    const response = await this.instance.post(url, data);
    return response.data;
  }

  async uploadFilePart(uploadUrl: string, data: any) {
    const response = await this.instance.post(uploadUrl, data);
    return response.data;
  }

  private async getPartsMap (fileName: string, splitSize: number) {
    const totalFileSize = await this.getTotalFileSize(fileName);
    const partsCount = Math.ceil(totalFileSize / splitSize);
  
    console.log({totalFileSize, partsCount});
    let parts = [];
    for (let i = 0; i < partsCount; i++) {
      const isLast = i + 1 === partsCount;
      parts.push({
        index: i, 
        start: i * splitSize, 
        end: isLast ? totalFileSize - 1 : (i+1) * splitSize - 1,
        isLast
      })
    }
  
    console.table(parts);
    return parts;
  }
  
  private async getTotalFileSize (fileName: string) {
    const stat = await fsPromises.stat(fileName);
    const totalFileSize = stat.size;
    return totalFileSize;
  }
  
  async uploadFile (fileName: string, filePath: string, contentType: string) {
    console.log({fileName, filePath, contentType});
    const splitSize = 32 * 1024;   // max 128 kb
    const partsMap = await this.getPartsMap(filePath, splitSize);
    
    // создаем сессию
    const data = {
      fileSize: await this.getTotalFileSize(filePath),
      fileName,
      contentType,
    };
    // console.log('data', data);
    const session = await this.createSession(data);
    console.log('session', JSON.stringify(session, null, 2));

    let uploadUrl = session.upload_url;
    // загружаем файл
    let fileUUID;

    for (const part of partsMap) {
      const data = fs.createReadStream(filePath, {
        encoding: null,
        start: part.start,
        end: part.end,
      });
      const result = await this.uploadFilePart(uploadUrl, data);
      // console.log('result', result);
      uploadUrl = result.next_url;
      if (part.isLast) {
        fileUUID = result.uuid;
      }
    }

    return fileUUID;
  }
}

