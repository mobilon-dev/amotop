import axios, { AxiosInstance } from 'axios';
import {requestLogger,responseLogger} from 'axios-logger';
import {jwtDecode} from 'jwt-decode'

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
}

