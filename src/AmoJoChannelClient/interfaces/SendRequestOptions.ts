export interface SendRequestOptions {
  data?: Record<string, unknown>,
  headers?: Record<string, string>,
  params?: Record<string, string | number | boolean>,
}
