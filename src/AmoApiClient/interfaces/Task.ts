
export interface Task {
  text: string;
  complete_till: number;
  entity_id?: number;
  entity_type?: string;
  task_type_id?: number;
  created_at?: number;
  created_by?: number;
  responsible_user_id?: number;
  duration?: number;
}
