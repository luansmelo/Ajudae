import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from 'src/core/domain/repositories/user.repository'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'
import { REPOSITORY_TOKENS } from 'src/shared/tokens'

@Injectable()
export class AuthService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async updateUserLastLogin(userId: number) {
    await this.userRepository.updateLastLogin(userId, new Date())
  }

  generateAccessToken(userId: number, email: string, role: string): string {
    return this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret:
          this.configService.get<string>('JWT_SECRET', { infer: true }) ||
          'default_secret',
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
      },
    )
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString('hex')
  }
}
