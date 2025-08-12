export interface Company {
  name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: {
    field_name: string;
    field_code: string;
    field_type: string;
    values: {
      value: string;
    }[];
  }[];
  _embedded?: Record<string, unknown>;
  tags_to_add?: unknown[];
  request_id?: string;
}
