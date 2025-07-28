import { Injectable } from '@nestjs/common'
import { Team } from 'src/core/domain/entities/team.entity'
import { CreateTeamDTO } from 'src/modules/team/dtos/create-team.dto'

@Injectable()
export class TeamMapper {
  static toEntity(prismaData: any): Team {
    return new Team({
      id: prismaData.id,
      name: prismaData.name,
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
    })
  }

  static toPrisma(dto: CreateTeamDTO) {
    return {
      name: dto.name,
    }
  }
}
