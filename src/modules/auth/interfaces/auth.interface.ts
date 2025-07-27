export interface JwtPayload {
    sub: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface JwtResponse {
    accessToken: string;
    refreshToken?: string
}