import { Inject, Injectable } from '@nestjs/common'
import { TeamRepository } from 'src/core/domain/repositories/team.repository'
import { REPOSITORY_TOKENS } from 'src/shared/tokens'
import { CreateTeamDTO } from '../dtos/create-team.dto'
import { Team } from 'src/core/domain/entities/team.entity'
import { TeamNameAlreadyInUseException } from 'src/core/domain/erros/team-name-already-in-use.exception'
import {
  createSingleResponse,
  SingleResponse,
} from 'src/core/common/helpers/response.helper'
import { PinoLogger } from 'src/core/common/logger/logger.service'
import { TeamResponseDTO } from '../dtos/team.response.dto'

/**
 * Caso de uso responsável pela criação de times no sistema.
 *
 * - Verifica se já existe um time com o mesmo nome.
 * - Cria uma nova entidade Team.
 * - Persiste o time no repositório.
 * - Retorna uma resposta padronizada com os dados do time criado.
 */
@Injectable()
export class AddTeamUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.TEAM_REPOSITORY)
    private readonly repository: TeamRepository,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Executa a criação de um novo time.
   *
   * @param teamDto - Dados necessários para criar o time.
   * @returns Um objeto contendo as informações do time criado.
   * @throws {TeamNameAlreadyInUseException} Se o nome do time já estiver registrado.
   */
  async execute(
    teamDto: CreateTeamDTO,
  ): Promise<SingleResponse<TeamResponseDTO>> {
    this.logger.debug(
      `Iniciando criação de time: ${teamDto.name}`,
      AddTeamUseCase.name,
    )

    const teamExists = await this.repository.findByName(teamDto.name)
    if (teamExists) {
      this.logger.warn(
        `Tentativa de criar time com nome já existente: ${teamDto.name}`,
        AddTeamUseCase.name,
      )
      throw new TeamNameAlreadyInUseException()
    }

    const team = new Team({
      name: teamDto.name,
    })

    const teamCreated = await this.repository.create(team)

    this.logger.log(
      `Time criado com sucesso: ${teamCreated.name}`,
      AddTeamUseCase.name,
    )

    const response: TeamResponseDTO = {
      id: teamCreated.id!,
      name: teamCreated.name,
      createdAt: teamCreated.createdAt!,
      updatedAt: teamCreated.updatedAt!,
    }

    return createSingleResponse(response)
  }
}
