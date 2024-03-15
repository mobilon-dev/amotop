export declare enum PhoneCallDirection {
    INBOUND = "inbound",
    OUTBOUND = "outbound"
}
export interface PhoneCallParams {
    direction: PhoneCallDirection;
    uniq?: string;
    duration: number;
    source: string;
    link?: string;
    phone: string;
    call_responsible: string | number | null;
    call_result?: number;
    responsible_user_id: number;
    created_by?: number;
    updated_by?: number;
    created_at?: number;
    updated_at?: number;
    request_id?: number;
}
