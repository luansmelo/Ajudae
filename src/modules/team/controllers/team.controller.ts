import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AddTeamUseCase } from '../usecases/add-team-usecase'
import { CreateTeamDTO } from '../dtos/create-team.dto'
import { TeamResponseDTO } from '../dtos/team.response.dto'
import { SingleResponse } from 'src/core/common/helpers/response.helper'

/**
 * Controller responsável pelo gerenciamento de times.
 *
 * - Permite criar novos times.
 * - Documenta a API com Swagger.
 */
@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly addTeam: AddTeamUseCase) {}

  /**
   * Cria um novo time no sistema.
   *
   * @param payload - Dados necessários para criação do time.
   * @returns Um objeto no formato `SingleResponse` contendo as informações do time criado.
   * @throws {TeamNameAlreadyInUseException} Caso já exista um time com o mesmo nome.
   */
  @Post()
  @ApiOperation({
    summary: 'Criação de um novo time',
    description:
      'Cria um novo time no sistema caso o nome informado ainda não esteja em uso.',
  })
  @ApiResponse({
    status: 201,
    description: 'Time criado com sucesso.',
    type: TeamResponseDTO,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um time com o mesmo nome.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos enviados para criação do time.',
  })
  async create(
    @Body() payload: CreateTeamDTO,
  ): Promise<SingleResponse<TeamResponseDTO>> {
    return this.addTeam.execute(payload)
  }
}
