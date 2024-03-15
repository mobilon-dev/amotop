export interface ImagePayloadFromUserParams {
    conversationId: string;
    amojoUserId: string;
    message: string;
    silent?: boolean;
    mediaUrl: string;
    sourceExternalId?: string;
}
