export * from './AmoJoChannelClientOptions';
export * from './SendRequestOptions';

export interface ConnectChannelResponse {
  id: string;
  name: string;
  status: string;
}

export interface DisconnectChannelResponse {
  success: boolean;
}
