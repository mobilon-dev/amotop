export * from './AmoApiClientOptions';
export * from './Task';
export * from './Note';
export * from './GetLeadsParams';
export * from './SourceParams';
export * from './WebhookParams';
export * from './Pipeline';
export * from './PhoneCallParams';
export * from './GetAccountParams';
export * from './GetTalkParams';
export * from './AddTagParams';
export * from './Tag';
export * from './Contact';
export * from './Company';

// Common types to replace 'any'
export type ApiResponse = Record<string, unknown>;
export interface FilterParams {
  createdAtFrom?: string;
  createdAtTo?: string;
}
export interface PageParams {
  page?: number;
  limit?: number;
}
export interface QueryParams {
  query?: string;
  with?: string;
}
export type EntityData = Record<string, unknown>;
export type CustomFieldData = Record<string, unknown>;
export interface TemplateData {
  name?: string;
  content?: string;
}
export type UnsortedData = Record<string, unknown>;
export interface WebhookData {
  destination: string;
  settings: Record<string, unknown>;
}
