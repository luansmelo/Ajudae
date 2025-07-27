import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { LoginUseCase } from './usecases/login-usecase'
import { RefreshTokenUseCase } from './usecases/refresh-token-usecase'
import { RevokeSessionUseCase } from './usecases/revoke-session.usecase'
import { AuthService } from './services/auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { REPOSITORY_TOKENS } from 'src/shared/tokens'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PrismaService } from 'src/core/infra/prisma/provider/prisma.provider'
import { UserModule } from '../user/user.module'
import { PrismaSessionRepository } from 'src/core/infra/prisma/repositories/session-prisma.repository'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = await Promise.resolve(
          configService.get<string>('JWT_SECRET'),
        )
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
          },
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    AuthService,
    LoginUseCase,
    RefreshTokenUseCase,
    RevokeSessionUseCase,
    JwtStrategy,
    PrismaService,
    {
      provide: REPOSITORY_TOKENS.SESSION_REPOSITORY,
      useClass: PrismaSessionRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
