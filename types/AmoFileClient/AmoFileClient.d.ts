import { AxiosInstance } from 'axios';
export declare class AmoFileClient {
    driveUrl: string;
    instance: AxiosInstance;
    accessToken: string;
    constructor(accessToken: string, options: any);
    getFiles(): Promise<any>;
    private hasScope;
    hasFilesScope(): boolean;
    hasFilesDeleteScope(): boolean;
    getFileByUUID(uuid: string): Promise<any>;
    createSession(params: any): Promise<any>;
    uploadFilePart(uploadUrl: string, data: any): Promise<any>;
}
