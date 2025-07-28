import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { UserModule } from './modules/user/user.module'
import { PrismaService } from './core/infra/prisma/provider/prisma.provider'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from './core/common/logger/logger.module'
import { TeamModule } from './modules/team/team.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TeamModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
