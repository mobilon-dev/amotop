import { ExchangeAccessTokenOptions, ExchangeCodeOptions, AmoServiceOptions } from './interfaces';
export declare class AmoService {
    private timeout;
    private axiosLoggerConfig;
    private debug;
    constructor(options: AmoServiceOptions | null);
    exchangeAccessToken(domain: string, data: ExchangeAccessTokenOptions): Promise<any>;
    exchangeCode(domain: string, data: ExchangeCodeOptions): Promise<any>;
}
