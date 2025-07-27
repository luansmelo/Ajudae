import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SessionRepository } from 'src/core/domain/repositories/session.repository'
import { REPOSITORY_TOKENS } from 'src/shared/tokens'

interface JwtPayload {
  sub: number
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REPOSITORY_TOKENS.SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    })
  }

  async validate(payload: JwtPayload) {
    const activeSession = await this.sessionRepository.findByUserId(payload.sub)
    if (
      !activeSession ||
      activeSession.isRevoked() ||
      activeSession.isExpired()
    ) {
      throw new UnauthorizedException('Session invalid or revoked')
    }
    return { userId: payload.sub, email: payload.email, role: payload.role }
  }
}
