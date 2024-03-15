export interface PageParams {
    name: string;
    id: string;
    link: string;
}
export interface ServiceParams {
    type: string;
    params?: {
        waba: boolean;
    };
    pages?: PageParams[];
}
export interface SourceParams {
    name: string;
    external_id: string;
    pipeline_id?: number;
    default?: boolean;
    origin_code?: string;
    services?: ServiceParams[];
}
