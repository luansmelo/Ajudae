import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { SessionRepository } from '../../../core/domain/repositories/session.repository'
import { UserRepository } from '../../../core/domain/repositories/user.repository'
import { Session } from '../../../core/domain/entities/session.entity'
import { REPOSITORY_TOKENS } from '../../../shared/utils/tokens'
import { AuthService } from '../services/auth.service'
import { LoginResponseDTO } from '../dtos/login.response.dto'
import { ONE_WEEK_IN_MS } from '../constants/constants'
import { PinoLogger } from '../../../core/common/logger/logger.service'

/**
 * Caso de uso responsável por renovar tokens de autenticação.
 *
 * - Valida o refresh token recebido
 * - Verifica se a sessão é válida, não expirada e não revogada
 * - Gera novos tokens (access e refresh)
 * - Atualiza a sessão no banco de dados
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Executa o fluxo de renovação de tokens.
   *
   * @param refreshToken - Token de atualização fornecido pelo cliente.
   * @returns Um objeto contendo `accessToken` e `refreshToken` atualizados.
   * @throws {UnauthorizedException} Se o refresh token for inválido, expirado, revogado ou se o usuário não existir.
   */
  async execute(refreshToken: string): Promise<LoginResponseDTO> {
    this.logger.debug(`Iniciando refresh token`, RefreshTokenUseCase.name)

    const session = await this.sessionRepository.findByToken(refreshToken)
    if (!session) {
      this.logger.warn(`Refresh token não encontrado`, RefreshTokenUseCase.name)
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    if (session.isRevoked()) {
      this.logger.warn(
        `Refresh token revogado: ${refreshToken}`,
        RefreshTokenUseCase.name,
      )
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    if (session.isExpired()) {
      this.logger.warn(
        `Refresh token expirado: ${refreshToken}`,
        RefreshTokenUseCase.name,
      )
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const user = await this.userRepository.findById(session.userId)
    if (!user) {
      this.logger.error(
        `Usuário não encontrado para o session.userId: ${session.userId}`,
        RefreshTokenUseCase.name,
      )
      throw new UnauthorizedException('User not found')
    }

    const newAccessToken = this.authService.generateAccessToken(
      user.id!,
      user.email,
      user.role!,
    )
    const newRefreshToken = this.authService.generateRefreshToken()

    this.logger.log(
      `Gerando novos tokens para o usuário ${user.email}`,
      RefreshTokenUseCase.name,
    )

    const expiresAt = new Date(Date.now() + ONE_WEEK_IN_MS)
    const updatedSession = new Session(
      session.id,
      session.userId,
      session.ipAddress,
      session.userAgent,
      newRefreshToken,
      expiresAt,
      null,
    )

    await this.sessionRepository.update(updatedSession)

    this.logger.debug(
      `Sessão atualizada para o usuário ${user.email}`,
      RefreshTokenUseCase.name,
    )

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }
}
