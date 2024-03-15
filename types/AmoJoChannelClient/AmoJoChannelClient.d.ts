import { AxiosInstance } from 'axios';
import { AmoJoChannelClientOptions } from './interfaces';
export declare class AmoJoChannelClient {
    instance: AxiosInstance;
    amoChatDomain: string;
    channelId: string;
    channelSecret: string;
    constructor(options: AmoJoChannelClientOptions);
    sendRequest(method: string, url: string, options: any | null): Promise<any>;
    private createSignatureForRequestBody;
    connectChannel(amojo_account_id: string, title: string, hook_api_version?: string): Promise<any>;
    disconnectChannel(account_id: string): Promise<any>;
}
