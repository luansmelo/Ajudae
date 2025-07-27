import { Module } from '@nestjs/common';
import { AddUserUseCase } from './usecases/add-user-usecase';
import { UserController } from './controllers/user.controller';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from 'src/shared/utils/tokens';
import { PrismaUserRepository } from 'src/core/infra/prisma/repositories/user-prisma.repository';
import { BcryptPasswordEncryptor } from 'src/core/infra/security/bcrypt-password-encryptor';
import { PrismaService } from 'src/core/infra/prisma/provider/prisma.provider';
import { LoadUserByIdUseCase } from './usecases/load-by-id-usecase';

@Module({
  controllers: [UserController],
  providers: [
    AddUserUseCase,
    LoadUserByIdUseCase,
    {
      provide: REPOSITORY_TOKENS.USER_REPOSITORY,
      useClass: PrismaUserRepository
    },
    {
      provide: SERVICE_TOKENS.PASSWORD_ENCRYPTOR,
      useClass: BcryptPasswordEncryptor
    },
    PrismaService
  ],
  exports: [AddUserUseCase, LoadUserByIdUseCase,
    {
      provide: REPOSITORY_TOKENS.USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: SERVICE_TOKENS.PASSWORD_ENCRYPTOR,
      useClass: BcryptPasswordEncryptor,
    }
  ]
})
export class UserModule { }
