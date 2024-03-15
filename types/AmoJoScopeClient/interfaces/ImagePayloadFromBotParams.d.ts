export interface ImagePayloadFromBotParams {
    conversationId: string;
    channelBotId: string;
    message: string;
    silent?: boolean;
    mediaUrl: string;
    sourceExternalId?: string;
}
