export interface ExchangeCodeOptions {
    client_id: string;
    client_secret: string;
    grant_type?: string;
    code: string;
    redirect_uri: string;
}
