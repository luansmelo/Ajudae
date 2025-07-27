import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDTO } from '../dtos/create-user.dto'
import { UserRepository } from '../../../core/domain/repositories/user.repository'
import { User } from '../../../core/domain/entities/user.entity'
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../shared/tokens'
import { PasswordEncryptor } from '../../../core/domain/interfaces/password-encryptor.interface'
import { createSingleResponse } from '../../../core/common/helpers/response.helper'
import { UserResponseDto } from '../dtos/user-response.dto'
import { EmailAlreadyInUseException } from '../../../core/domain/erros/email-already-in-use.exception'
import { PinoLogger } from '../../../core/common/logger/logger.service'

/**
 * Caso de uso responsável pela criação de usuários no sistema.
 *
 * - Verifica se o e-mail já está em uso.
 * - Criptografa a senha.
 * - Persiste o novo usuário no repositório.
 * - Retorna uma resposta padronizada com os dados do usuário criado.
 */
@Injectable()
export class AddUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly repository: UserRepository,
    @Inject(SERVICE_TOKENS.PASSWORD_ENCRYPTOR)
    private readonly passwordEncryptor: PasswordEncryptor,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Executa a criação de um novo usuário.
   *
   * @param userDto - Dados necessários para criar o usuário.
   * @returns Um objeto contendo as informações do usuário criado.
   * @throws {EmailAlreadyInUseException} Se o e-mail fornecido já estiver registrado.
   */
  async execute(userDto: CreateUserDTO) {
    this.logger.debug(
      `Iniciando criação de usuário: ${userDto.email}`,
      AddUserUseCase.name,
    )

    const userExists = await this.repository.emailExists(userDto.email)
    if (userExists) {
      this.logger.warn(
        `Tentativa de criar usuário com email já existente: ${userDto.email}`,
        AddUserUseCase.name,
      )
      throw new EmailAlreadyInUseException()
    }

    const hashedPassword = await this.passwordEncryptor.encrypt(
      userDto.password,
    )

    const user = new User({
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
    })

    const createdUser = await this.repository.create(user)

    this.logger.log(
      `Usuário criado com sucesso: ${createdUser.email}`,
      AddUserUseCase.name,
    )

    const userResponse: UserResponseDto = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    }

    return createSingleResponse(userResponse)
  }
}
