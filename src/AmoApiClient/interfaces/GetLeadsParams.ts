export interface GetLeadsParams {
  with?: string,
  page?: number,
  limit?: number,
  query?: string,
  filter?: {
    createdAtFrom?: number,
    createdAtTo?: number,
  },
}
