export interface TextPayloadFromContactParams {
    conversationId: string;
    senderName: string;
    message: string;
    silent?: boolean;
    sourceExternalId?: string;
}
