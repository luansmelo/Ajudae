import { Injectable } from '@nestjs/common'
import { PrismaService } from '../provider/prisma.provider'
import { BasePrismaRepository } from './base-prisma.repository'
import { Team } from '../../../../core/domain/entities/team.entity'
import { Team as TeamModel } from '@prisma/client'
import { TeamMapper } from '../mappers/team.mapper'
import { TeamRepository } from 'src/core/domain/repositories/team.repository'

@Injectable()
export class PrismaTeamRepository
  extends BasePrismaRepository<Team, TeamModel>
  implements TeamRepository
{
  constructor(prisma: PrismaService) {
    super(
      prisma.team,
      (data) => TeamMapper.toEntity(data),
      (data) => TeamMapper.toPrisma(data),
    )
  }

  async create(data: Team): Promise<Team> {
    const teamData = TeamMapper.toPrisma(data)
    const created = await this.prismaModel.create({ data: teamData })
    return TeamMapper.toEntity(created)
  }

  async findByName(name: string): Promise<Team | null> {
    const team = await this.prismaModel.findUnique({ where: { name } })
    return team ? TeamMapper.toEntity(team) : null
  }
}
