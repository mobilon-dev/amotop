export interface TextPayloadFromBotParams {
    conversationId: string;
    channelBotId: string;
    message: string;
    silent?: boolean;
    sourceExternalId?: string;
}
