export interface Note {
    entity_id?: number;
    created_by?: number;
    note_type: string;
    params?: object;
    request_id?: string;
    is_need_to_trigger_digital_pipeline: boolean;
}
