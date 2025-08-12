import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';

import {
  ExchangeAccessTokenOptions,
  ExchangeCodeOptions,
  AmoServiceOptions,
} from './interfaces';

interface AxiosLoggerConfig {
  prefixText: string;
  headers: boolean;
  params: boolean;
}

export class AmoService {
  private readonly timeout: number;
  private readonly axiosLoggerConfig: AxiosLoggerConfig;
  private readonly debug: boolean;

  constructor(options: AmoServiceOptions | null) {
    this.timeout = options?.timeout || 10000;
    this.debug = options?.debug || false;
    this.axiosLoggerConfig = {
      prefixText: 'AmoService',
      headers: false,
      params: true,
    };
  }

  private createAxiosClient(domain: string): AxiosInstance {
    if (!domain || typeof domain !== 'string') {
      throw new Error('Domain must be a non-empty string');
    }

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

    return client;
  }

  private async makeOAuthRequest(
    domain: string, 
    data: ExchangeAccessTokenOptions | ExchangeCodeOptions, 
    grantType: 'refresh_token' | 'authorization_code'
  ) {
    try {
      const client = this.createAxiosClient(domain);
      const exchangeData = { ...data, grant_type: grantType };
      const response = await client.post('/oauth2/access_token', exchangeData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OAuth request failed: ${error.response?.data?.message || error.message}`);
      }
      throw new Error(`Unexpected error during OAuth request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async exchangeAccessToken(domain: string, data: ExchangeAccessTokenOptions) {
    if (!data || typeof data !== 'object') {
      throw new Error('ExchangeAccessTokenOptions must be a valid object');
    }

    return this.makeOAuthRequest(domain, data, 'refresh_token');
  }

  async exchangeCode(domain: string, data: ExchangeCodeOptions) {
    if (!data || typeof data !== 'object') {
      throw new Error('ExchangeCodeOptions must be a valid object');
    }

    return this.makeOAuthRequest(domain, data, 'authorization_code');
  }
}
