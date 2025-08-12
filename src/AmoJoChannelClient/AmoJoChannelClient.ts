import {createHmac} from 'crypto';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {requestLogger,responseLogger} from 'axios-logger';

import {
  AmoJoChannelClientOptions, 
  SendRequestOptions,
  ConnectChannelResponse,
  DisconnectChannelResponse
} from './interfaces';

export class AmoJoChannelClient {
  private readonly instance: AxiosInstance;
  private readonly amoChatDomain: string;
  private readonly channelId: string;
  private readonly channelSecret: string;

  constructor(options: AmoJoChannelClientOptions) {
    if (!options.channelId) {
      throw new Error('ERROR_NO_CHANNELID');
    }
    this.channelId = options.channelId;

    if (!options.channelSecret) {
      throw new Error('ERROR_NO_CHANNELSECRET');
    }
    this.channelSecret = options.channelSecret;

    this.amoChatDomain = options.amoChatDomain || 'amojo.amocrm.ru';

    this.instance = axios.create({
      baseURL: `https://${this.amoChatDomain}/v2/origin/custom`,
      timeout: options.timeout || 10000,
    });
    
    if (options?.debug) {
      const config = {
        prefixText: 'AmoJoChannelClient',
        // status: true,
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

  // Геттеры для публичного доступа к необходимым свойствам
  getChannelId(): string {
    return this.channelId;
  }

  getAmoChatDomain(): string {
    return this.amoChatDomain;
  }

  async sendRequest<T = Record<string, unknown>>(method: string, url: string, options: SendRequestOptions = {}): Promise<T> {
    try {
      const content = options.data || '';
      const bodyContent = (content === '') ? '' : JSON.stringify(content);

      const response: AxiosResponse<T> = await this.instance({
        method,
        url,
        headers: {
          'x-signature': this.createSignatureForRequestBody(bodyContent),
          ...options.headers,
        },
        data: options.data,
        params: options.params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Request failed: ${error.message} - ${error.response?.data || 'Unknown error'}`);
      }
      throw error;
    }
  }

  private createSignatureForRequestBody(body: string): string {
    return createHmac('sha1', this.channelSecret).update(body).digest('hex');
  }

  async connectChannel(amojo_account_id: string, title: string, hook_api_version = 'v2'): Promise<ConnectChannelResponse> {
    return await this.sendRequest<ConnectChannelResponse>('POST', `${this.channelId}/connect`, { 
      data: {
        account_id: amojo_account_id,
        title,
        hook_api_version,
      },
    });
  }
  
  async disconnectChannel(amojo_account_id: string): Promise<DisconnectChannelResponse> {
    return await this.sendRequest<DisconnectChannelResponse>('DELETE', `${this.channelId}/disconnect`, { 
      data: {
        account_id: amojo_account_id,
      },
    });
  }
}

