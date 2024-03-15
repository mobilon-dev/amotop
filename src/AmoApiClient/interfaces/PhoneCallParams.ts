
export enum PhoneCallDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export interface PhoneCallParams {
  direction: PhoneCallDirection;
  uniq?: string;
  duration: number; // seconds
  source: string;
  link?: string;
  phone: string;
  call_responsible: string | number | null; 
  call_result?: number;
  responsible_user_id: number; // userId
  created_by?: number; // userId
  updated_by?: number; // userId
  created_at?: number; // unixtimestamp
  updated_at?: number; // unixtimestamp
  request_id?: number;
}
