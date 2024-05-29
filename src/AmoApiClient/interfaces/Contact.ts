export interface Contact {
  name: string;
  custom_fields_values: [{
    field_name: string;
    field_code: string;
    field_type: string;
    values: [{
      value: string;
    }],
  }],
  created_at: number;
};
