export interface AmoJoChannelClientOptions {
    amoChatDomain?: string;
    debug?: boolean;
    channelSecret: string;
    channelId: string;
    timeout?: number | 10000;
}
