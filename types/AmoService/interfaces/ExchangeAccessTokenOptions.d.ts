export interface ExchangeAccessTokenOptions {
    client_id: string;
    client_secret: string;
    grant_type?: string;
    refresh_token: string;
    redirect_uri: string;
}
