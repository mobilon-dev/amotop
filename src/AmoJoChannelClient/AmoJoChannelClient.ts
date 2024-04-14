import {createHmac} from 'crypto';
import axios, { AxiosInstance } from 'axios';
import {requestLogger,responseLogger} from 'axios-logger';

import {AmoJoChannelClientOptions, SendRequestOptions} from './interfaces';

export class AmoJoChannelClient {
  instance: AxiosInstance;
  amoChatDomain: string;
  channelId: string;
  channelSecret: string;

  constructor(options: AmoJoChannelClientOptions) {
    this.amoChatDomain = options.amoChatDomain ? options.amoChatDomain : 'amojo.amocrm.ru';

    if (!options.channelId) {
      throw new Error('ERROR_NO_CHANNELID');
    }
    this.channelId = options.channelId;

    if (!options.channelSecret) {
      throw new Error('ERROR_NO_CHANNELSECRET');
    }
    this.channelSecret = options.channelSecret;

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

  async sendRequest(method: string, url: string, options: SendRequestOptions) {
    const content = options && options.data ? options.data : '';
    const bodyContent = (content === '') ? '' : JSON.stringify(content);

    const response = await this.instance({
      method,
      url,
      headers: {
        'x-signature': this.createSignatureForRequestBody(bodyContent),
      },
      ...options,
    });
    return response.data;
  }

  private createSignatureForRequestBody(body: string): string {
    return createHmac('sha1', this.channelSecret).update(body).digest('hex');
  }

  async connectChannel(amojo_account_id: string, title: string, hook_api_version = 'v2') {
    return await this.sendRequest('POST', `${this.channelId}/connect`, { 
      data: {
        account_id: amojo_account_id,
        title,
        hook_api_version,
      },
    });
  }
  
  async disconnectChannel(amojo_account_id: string) {
    return await this.sendRequest('DELETE', `${this.channelId}/disconnect`, { 
      data: {
        account_id: amojo_account_id,
      },
    });
  }
}

