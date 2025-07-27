import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'
import { AddUserUseCase } from '../usecases/add-user-usecase'
import { CreateUserDTO } from '../dtos/create-user.dto'
import { LoadUserByIdUseCase } from '../usecases/load-by-id-usecase'
import { JwtGuard } from '../../../modules/auth/guards/jwt.guard'
import { UserResponseDto } from '../dtos/user-response.dto'

/**
 * Controller responsável por gerenciar operações relacionadas a usuários.
 *
 * - Criação de novos usuários.
 * - Consulta de usuário por ID.
 */
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly addUser: AddUserUseCase,
    private readonly loadByIdUseCase: LoadUserByIdUseCase,
  ) {}

  /**
   * Cria um novo usuário no sistema.
   *
   * @route POST /user/signup
   * @param payload - Dados do novo usuário.
   * @returns Dados do usuário criado.
   * @throws {EmailAlreadyInUseException} Se o e-mail já estiver cadastrado.
   */
  @Post('/signup')
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'E-mail já está em uso' })
  async create(@Body() payload: CreateUserDTO) {
    return this.addUser.execute(payload)
  }

  /**
   * Busca um usuário pelo seu ID.
   *
   * @route GET /user/:id
   * @param id - Identificador único do usuário.
   * @returns Dados do usuário correspondente ao ID.
   * @throws {UnauthorizedException} Caso o token JWT seja inválido.
   */
  @Get('/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtém um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findById(@Param('id') id: number) {
    return this.loadByIdUseCase.execute(id)
  }
}
