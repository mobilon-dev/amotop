export interface GetLeadsParams {
    page?: number;
    limit?: number;
    query?: string;
    filter?: {
        createdAtFrom?: number;
        createdAtTo?: number;
    };
}
