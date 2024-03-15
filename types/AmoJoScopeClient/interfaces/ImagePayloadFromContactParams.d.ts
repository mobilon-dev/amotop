export interface ImagePayloadFromContactParams {
    conversationId: string;
    senderName: string;
    message?: string;
    silent?: boolean;
    mediaUrl: string;
    sourceExternalId?: string;
}
