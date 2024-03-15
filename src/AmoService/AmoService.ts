import axios from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';

import {
  ExchangeAccessTokenOptions,
  ExchangeCodeOptions,
  AmoServiceOptions,
} from './interfaces';

export class AmoService {
  private timeout: number;
  private axiosLoggerConfig: object;
  private debug: boolean;

  constructor (options: AmoServiceOptions | null) {
    this.timeout = options?.timeout || 10000;
    this.debug = options?.debug;
    this.axiosLoggerConfig = {
      prefixText: 'AmoService',
      headers: false,
      params: true,
    };
  }

  async exchangeAccessToken(domain: string, data: ExchangeAccessTokenOptions) {
    const client = axios.create({
      baseURL: `https://${domain}`,
      timeout: this.timeout,
    });

    if (this.debug) {
      client.interceptors.request.use((request) => {
        return requestLogger(request, this.axiosLoggerConfig);
      });
      client.interceptors.response.use((response) => {
        return responseLogger(response, this.axiosLoggerConfig);
      });
    }

    const exchangeData = {...data, grant_type: 'refresh_token'};
    const response = await client.post('/oauth2/access_token', exchangeData);
    return response.data;
  }

  async exchangeCode(domain: string, data: ExchangeCodeOptions) {
    const client = axios.create({
      baseURL: `https://${domain}`,
      timeout: this.timeout,
    });

    if (this.debug) {
      client.interceptors.request.use((request) => {
        return requestLogger(request, this.axiosLoggerConfig);
      });
      client.interceptors.response.use((response) => {
        return responseLogger(response, this.axiosLoggerConfig);
      });
    }

    const exchangeData = {...data, grant_type: 'authorization_code'};
    const response = await client.post('/oauth2/access_token', exchangeData);
    return response.data;
  }
}
