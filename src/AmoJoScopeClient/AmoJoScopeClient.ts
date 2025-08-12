import {createHmac, createHash, randomUUID} from 'crypto';
import axios, { AxiosInstance } from 'axios';
import {requestLogger,responseLogger} from 'axios-logger';

import {
  AmoJoScopeClientOptions,
  TextPayloadFromBotParams,
  TextPayloadFromUserParams,
  TextPayloadFromContactParams,
  ImagePayloadFromBotParams,
  ImagePayloadFromUserParams,
  ImagePayloadFromContactParams,
  DeliveryStatusEnum,
} from './interfaces/index';

export class AmoJoScopeClient {
  private readonly instance: AxiosInstance;
  private readonly amoChatDomain: string;
  private readonly scopeId: string;
  private readonly channelSecret: string;

  constructor(options: AmoJoScopeClientOptions) {
    this.amoChatDomain = options.amoChatDomain ? options.amoChatDomain : 'amojo.amocrm.ru';
    if (!options.scopeId) {
      throw new Error('ERROR_NO_SCOPEID');
    }
    this.scopeId = options.scopeId;

    if (!options.channelSecret) {
      throw new Error('ERROR_NO_CHANNELSECRET');
    }
    this.channelSecret = options.channelSecret;

    this.instance = axios.create({
      baseURL: `https://${this.amoChatDomain}/v2/origin/custom`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: options.timeout || 10000,
    });

    if (options?.debug) {
      const config = {
        prefixText: 'AmoJoScopeClient',
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
  getScopeId(): string {
    return this.scopeId;
  }

  getAmoChatDomain(): string {
    return this.amoChatDomain;
  }

  private async sendRequest(method: string, url: string, options?: { data?: unknown }) {
    const content = options && options.data ? options.data : '';
    const bodyContent = (content === '') ? '' : JSON.stringify(content);

    const checkSum = this.createCheckSum(method, bodyContent);
    const date = (new Date()).toUTCString();

    const hashString = [
      method.toUpperCase(),
      checkSum,
      'application/json',
      date,
      `/v2/origin/custom${url}`,
    ].join('\n');

    const response = await this.instance({
      method,
      url,
      headers: {
        'Date': date,
        'Content-MD5': checkSum,
        'X-Signature': this.createSignatureForRequestBody(hashString),
      },
      ...options,
    });
    return response.data;
  }

  private createSignatureForRequestBody(body: string): string {    
    return createHmac('sha1', this.channelSecret).update(body).digest('hex');
  }

  private createCheckSum(method: string, bodyContent: string): string {
    const body = (method.toLowerCase() === 'get') ? '' : bodyContent;
    return createHash('md5').update(body).digest('hex');
  }

  getChatDto (amojoUserId: string) {
    return {
      conversation_id: randomUUID(),
      user: {
        // id: randomUUID(),
        ref_id: amojoUserId,
        // name: 'Unknown',
      },
    };
  }

  async createChat(chatDto: Record<string, unknown>) {
    return await this.sendRequest('POST', `/${this.scopeId}/chats`, {data: chatDto});
  }

  async sendMessage(payload: Record<string, unknown>) {
    const data = {
      event_type: 'new_message',
      payload,
    };
    return await this.sendRequest('POST', `/${this.scopeId}`, {data});
  }

  async getChatHistory(conversationId: string) {
    return await this.sendRequest('GET', `/${this.scopeId}/chats/${conversationId}/history`);
  }

  async updateMessageStatus(msgid: string, deliveryStatus: DeliveryStatusEnum, errorCode?: number, error?: string) {
    const data = {
      msgid,
      delivery_status: deliveryStatus,
      error_code: errorCode ? errorCode : null,
      error: error ? error: null,
    };

    // вернет пустой контент
    return await this.sendRequest('POST', `/${this.scopeId}/${msgid}/delivery_status`, {data});
  }

  private getSenderReceiverFromBot (params: { channelBotId: string }) {
    return {
      sender: {
        id: randomUUID(),
        ref_id: params.channelBotId,
        name: 'Bot',
      },
      receiver: {
        id: randomUUID(),
        name: 'Unknown',
      },
    }
  }

  private getConversationIds (conversationId: string) {
    return {
      conversation_id: randomUUID(),
      conversation_ref_id: conversationId,
    }
  }

  private getSilent (silent: boolean | null): Record<string, boolean> | null {
    return silent ? { silent: true, } : null;
  }

  private getMessageIdAndDate () {
    const time = (new Date()).getTime();
    return {
      msec_timestamp: time,
      timestamp: Math.floor(time / 1000),
      msgid: randomUUID(), // должно быть уникальным
    };
  }

  private getMessageDate () {
    const time = (new Date()).getTime();
    return {
      msec_timestamp: time,
      timestamp: Math.floor(time / 1000),
    };
  }

  private getSource (sourceExternalId: string | null): Record<string, { external_id: string }> | null {
    return sourceExternalId ? {
      source: {
        external_id: sourceExternalId,
      },
    } : null;
  }

  private getSenderRecieverFromUser(params: { amojoUserId: string }) {
    return {
      sender: {
        id: randomUUID(),
        ref_id: params.amojoUserId,
        name: 'Unknown',
      },
      receiver: {
        id: randomUUID(),
        name: 'Unknown',
      },
    }
  }

  private getSenderReceiverFromContact(params: { senderName: string }) {
    return {
      sender: {
        id: randomUUID(),
        name: params.senderName,
      },
    };
  }

  private getQuoteSender (params: { senderName: string }) {
    return this.getSenderReceiverFromContact(params);
  }

  private getTextMessage (params: { message: string }) {
    return {
      message: {
        type: 'text',
        text: params.message,
      },
    };
  }

  private getImageMessage (params: { message?: string; mediaUrl: string }) {
    return {
      message: {
        type: 'picture',
        text: params.message ? params.message : null,
        media: params.mediaUrl,
      },
    }
  }

  private getVideoMessage (params: { message?: string; mediaUrl: string }) {
    return {
      message: {
        type: 'video',
        text: params.message ? params.message : null,
        media: params.mediaUrl,
      },
    }
  }

  private getAudioMessage (params: { message?: string; mediaUrl: string }) {
    return {
      message: {
        type: 'voice',
        text: params.message ? params.message : null,
        media: params.mediaUrl,
      },
    }
  }

  /**
  * @group Payloads Text
  */
  getTextPayloadFromBot (params: TextPayloadFromBotParams): Record<string, unknown> {    
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromBot({channelBotId: params.channelBotId}),
      ...this.getTextMessage({message: params.message}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Text
  */
  getTextPayloadFromUser (params: TextPayloadFromUserParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderRecieverFromUser({amojoUserId: params.amojoUserId}),
      ...this.getTextMessage({message: params.message}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Text
  */
  getTextPayloadFromContact (params: TextPayloadFromContactParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromContact({senderName: params.senderName}),
      ...this.getTextMessage({message: params.message}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  getQuoteTextMessage (params: { message: string; senderName: string }): Record<string, unknown> {
    return {
      reply_to: {
        message: {
          ...(this.getTextMessage({message: params.message}).message),
          ...this.getMessageIdAndDate(),
          ...this.getQuoteSender({senderName: params.senderName}),
        }
      }
    }
  }

  getQuoteImageMessage (params: { mediaUrl: string; senderName: string }): Record<string, unknown> {
    return {
      reply_to: {
        message: {
          ...(this.getImageMessage({mediaUrl: params.mediaUrl}).message),
          ...this.getMessageDate(),
          ...this.getQuoteSender({senderName: params.senderName}),
          // file_name: 'test.jpg',
          // file_size: 20142,
          // msgid: '308d7955-8466-4bae-a2c7-edada8561457',
        }
      }
    }
  }

  getQuoteVideoMessage (params: { mediaUrl: string; senderName: string }): Record<string, unknown> {
    return {
      reply_to: {
        message: {
          ...(this.getVideoMessage({mediaUrl: params.mediaUrl}).message),
          ...this.getMessageDate(),
          ...this.getQuoteSender({senderName: params.senderName}),
          // file_name: 'test.avi',
          // file_size: 20142000,
          // msgid: '308d7955-8466-4bae-a2c7-edada8561457',
        }
      }
    }
  }

  /**
  * @group Payloads Image
  */
  getImagePayloadFromBot (params: ImagePayloadFromBotParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromBot({channelBotId: params.channelBotId}),
      ...this.getImageMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Image
  */
  getImagePayloadFromUser (params: ImagePayloadFromUserParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderRecieverFromUser({amojoUserId: params.amojoUserId}),
      ...this.getImageMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Image
  */
  getImagePayloadFromContact (params: ImagePayloadFromContactParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromContact({senderName: params.senderName}),      
      ...this.getImageMessage({message: params.message, mediaUrl: params.mediaUrl}),      
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Video
  */
  getVideoPayloadFromBot (params: ImagePayloadFromBotParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromBot({channelBotId: params.channelBotId}),
      ...this.getVideoMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Video
  */
  getVideoPayloadFromUser (params: ImagePayloadFromUserParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderRecieverFromUser({amojoUserId: params.amojoUserId}),
      ...this.getVideoMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Video
  */
  getVideoPayloadFromContact (params: ImagePayloadFromContactParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromContact({senderName: params.senderName}),      
      ...this.getVideoMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Audio
  */
  getAudioPayloadFromBot (params: ImagePayloadFromBotParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromBot({channelBotId: params.channelBotId}),
      ...this.getAudioMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Audio
  */
  getAudioPayloadFromUser (params: ImagePayloadFromUserParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderRecieverFromUser({amojoUserId: params.amojoUserId}),
      ...this.getAudioMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }

  /**
  * @group Payloads Audio
  */
  getAudioPayloadFromContact (params: ImagePayloadFromContactParams): Record<string, unknown> {
    const basePayload = {
      ...this.getMessageIdAndDate(),
      ...this.getConversationIds(params.conversationId),
      ...this.getSenderReceiverFromContact({senderName: params.senderName}),
      ...this.getAudioMessage({message: params.message, mediaUrl: params.mediaUrl}),
    };

    const silent = this.getSilent(params.silent);
    const source = this.getSource(params.sourceExternalId);

    return {
      ...basePayload,
      ...(silent || {}),
      ...(source || {}),
    };
  }
}
