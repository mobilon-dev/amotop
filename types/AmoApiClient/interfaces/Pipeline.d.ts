export interface Pipeline {
    id: number;
    name: string;
    is_main: boolean;
    _embedded: {
        statuses: PipelineStatus[];
    };
}
export interface PipelineStatus {
    id: number;
    name: string;
    is_editable: boolean;
    type: PipelineStatusType;
}
export declare enum PipelineStatusType {
    Regular = 0,
    Unsorted = 1
}
