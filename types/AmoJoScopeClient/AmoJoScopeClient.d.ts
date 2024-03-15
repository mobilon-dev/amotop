import { AxiosInstance } from 'axios';
import { AmoJoScopeClientOptions, TextPayloadFromBotParams, TextPayloadFromUserParams, TextPayloadFromContactParams, ImagePayloadFromBotParams, ImagePayloadFromUserParams, ImagePayloadFromContactParams, DeliveryStatusEnum } from './interfaces/index';
export declare class AmoJoScopeClient {
    instance: AxiosInstance;
    amoChatDomain: string;
    scopeId: string;
    channelSecret: string;
    constructor(options: AmoJoScopeClientOptions);
    private sendRequest;
    private createSignatureForRequestBody;
    private createCheckSum;
    getChatDto(amojoUserId: string): {
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        user: {
            ref_id: string;
        };
    };
    createChat(chatDto: any): Promise<any>;
    sendMessage(payload: any): Promise<any>;
    getChatHistory(conversationId: string): Promise<any>;
    updateMessageStatus(msgid: string, deliveryStatus: DeliveryStatusEnum, errorCode?: number, error?: string): Promise<any>;
    private getSenderReceiverFromBot;
    private getConversationIds;
    private getSilent;
    private getMessageIdAndDate;
    private getMessageDate;
    private getSource;
    private getSenderRecieverFromUser;
    private getSenderReceiverFromContact;
    private getQuoteSender;
    private getTextMessage;
    private getImageMessage;
    private getVideoMessage;
    private getAudioMessage;
    /**
    * @group Payloads Text
    */
    getTextPayloadFromBot(params: TextPayloadFromBotParams): {
        message: {
            type: string;
            text: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            ref_id: any;
            name: string;
        };
        receiver: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: string;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
    /**
    * @group Payloads Text
    */
    getTextPayloadFromUser(params: TextPayloadFromUserParams): any;
    /**
    * @group Payloads Text
    */
    getTextPayloadFromContact(params: TextPayloadFromContactParams): {
        message: {
            type: string;
            text: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: any;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
    getQuoteTextMessage(params: any): {
        reply_to: {
            message: {
                sender: {
                    id: `${string}-${string}-${string}-${string}-${string}`;
                    name: any;
                };
                msec_timestamp: number;
                timestamp: number;
                msgid: `${string}-${string}-${string}-${string}-${string}`;
                type: string;
                text: any;
            };
        };
    };
    getQuoteImageMessage(params: any): {
        reply_to: {
            message: {
                sender: {
                    id: `${string}-${string}-${string}-${string}-${string}`;
                    name: any;
                };
                msec_timestamp: number;
                timestamp: number;
                type: string;
                text: any;
                media: any;
            };
        };
    };
    getQuoteVideoMessage(params: any): {
        reply_to: {
            message: {
                sender: {
                    id: `${string}-${string}-${string}-${string}-${string}`;
                    name: any;
                };
                msec_timestamp: number;
                timestamp: number;
                type: string;
                text: any;
                media: any;
            };
        };
    };
    /**
    * @group Payloads Image
    */
    getImagePayloadFromBot(params: ImagePayloadFromBotParams): {
        message: {
            type: string;
            text: any;
            media: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            ref_id: any;
            name: string;
        };
        receiver: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: string;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
    /**
    * @group Payloads Image
    */
    getImagePayloadFromUser(params: ImagePayloadFromUserParams): any;
    /**
    * @group Payloads Image
    */
    getImagePayloadFromContact(params: ImagePayloadFromContactParams): {
        message: {
            type: string;
            text: any;
            media: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: any;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
    /**
    * @group Payloads Video
    */
    getVideoPayloadFromBot(params: ImagePayloadFromBotParams): {
        message: {
            type: string;
            text: any;
            media: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            ref_id: any;
            name: string;
        };
        receiver: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: string;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
    /**
    * @group Payloads Video
    */
    getVideoPayloadFromUser(params: ImagePayloadFromUserParams): any;
    /**
    * @group Payloads Video
    */
    getVideoPayloadFromContact(params: ImagePayloadFromContactParams): {
        message: {
            type: string;
            text: any;
            media: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: any;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
    /**
    * @group Payloads Audio
    */
    getAudioPayloadFromBot(params: ImagePayloadFromBotParams): {
        message: {
            type: string;
            text: any;
            media: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            ref_id: any;
            name: string;
        };
        receiver: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: string;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
    /**
    * @group Payloads Audio
    */
    getAudioPayloadFromUser(params: ImagePayloadFromUserParams): any;
    /**
    * @group Payloads Audio
    */
    getAudioPayloadFromContact(params: ImagePayloadFromContactParams): {
        message: {
            type: string;
            text: any;
            media: any;
        };
        sender: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: any;
        };
        conversation_id: `${string}-${string}-${string}-${string}-${string}`;
        conversation_ref_id: string;
        source: {
            external_id: string;
        };
        silent: boolean;
        msec_timestamp: number;
        timestamp: number;
        msgid: `${string}-${string}-${string}-${string}-${string}`;
    };
}
