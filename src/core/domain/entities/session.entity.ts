export class Session {
  constructor(
    public readonly id: number | null,
    public readonly userId: number,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly refreshToken: string,
    public readonly expiresAt: Date,
    public readonly revokedAt?: Date | null,
  ) {}

  isRevoked(): boolean {
    return !!this.revokedAt
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt
  }
}
