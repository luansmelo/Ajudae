import { Injectable, NotFoundException } from '@nestjs/common'
import { SessionRepository } from '../../../../core/domain/repositories/session.repository'
import { PrismaService } from '../provider/prisma.provider'
import { Session } from '../../../../core/domain/entities/session.entity'

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(session: Session): Promise<void> {
    await this.prisma.session.create({
      data: {
        userId: session.userId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt ?? null,
      },
    })
  }

  async findByToken(token: string): Promise<Session | null> {
    const data = await this.prisma.session.findUnique({
      where: { refreshToken: token },
    })
    if (!data) return null

    return new Session(
      data.id,
      data.userId,
      data.ipAddress!,
      data.userAgent!,
      data.refreshToken,
      data.expiresAt,
      data.revokedAt,
    )
  }

  async revokeToken(token: string): Promise<void> {
    const updated = await this.prisma.session.updateMany({
      where: {
        refreshToken: token,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { revokedAt: new Date() },
    })
    if (updated.count === 0) {
      throw new NotFoundException(`No active session found for token: ${token}`)
    }
  }
  async revokeAll(userId: number): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  async update(session: Session): Promise<void> {
    await this.prisma.session.update({
      where: { id: session.id! },
      data: {
        userId: session.userId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt ?? null,
      },
    })
  }

  async findByUserId(userId: number): Promise<Session | null> {
    const data = await this.prisma.session.findFirst({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    })
    if (!data) return null
    return new Session(
      data.id,
      data.userId,
      data.ipAddress!,
      data.userAgent!,
      data.refreshToken,
      data.expiresAt,
      data.revokedAt,
    )
  }
}
