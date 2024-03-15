export interface TextPayloadFromUserParams {
    conversationId: string;
    amojoUserId: string;
    message: string;
    silent?: boolean;
    sourceExternalId?: string;
}
