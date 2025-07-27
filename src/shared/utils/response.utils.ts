export interface SingleResponse<T> {
    data: T;
}

export function createSingleResponse<T>(data: T): SingleResponse<T> {
    return { data };
}