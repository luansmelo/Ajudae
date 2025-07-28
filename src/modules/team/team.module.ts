import { Module } from '@nestjs/common'
import { REPOSITORY_TOKENS } from 'src/shared/tokens'
import { PrismaService } from 'src/core/infra/prisma/provider/prisma.provider'
import { AddTeamUseCase } from './usecases/add-team-usecase'
import { TeamController } from './controllers/team.controller'
import { PrismaTeamRepository } from 'src/core/infra/prisma/repositories/team-prisma.repository'

@Module({
  controllers: [TeamController],
  providers: [
    AddTeamUseCase,
    {
      provide: REPOSITORY_TOKENS.TEAM_REPOSITORY,
      useClass: PrismaTeamRepository,
    },
    PrismaService,
  ],
  exports: [
    AddTeamUseCase,
    {
      provide: REPOSITORY_TOKENS.TEAM_REPOSITORY,
      useClass: PrismaTeamRepository,
    },
  ],
})
export class TeamModule {}
