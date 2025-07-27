import { Inject, Injectable } from '@nestjs/common'
import { PinoLogger } from '../../../core/common/logger/logger.service'
import { SessionRepository } from '../../../core/domain/repositories/session.repository'
import { REPOSITORY_TOKENS } from '../../../shared/tokens'

/**
 * Caso de uso responsável por revogar sessões e refresh tokens.
 *
 * - Revoga um refresh token específico.
 * - Revoga todas as sessões de um usuário.
 */
@Injectable()
export class RevokeSessionUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.SESSION_REPOSITORY)
    private readonly sessionRepo: SessionRepository,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Revoga um refresh token específico no banco de dados.
   *
   * @param refreshToken - Token de atualização a ser revogado.
   * @returns Uma Promise que é resolvida quando a operação é concluída.
   */
  async execute(refreshToken: string): Promise<void> {
    this.logger.debug(
      `Iniciando revogação do refresh token`,
      RevokeSessionUseCase.name,
    )

    await this.sessionRepo.revokeToken(refreshToken)

    this.logger.log(
      `Refresh token revogado com sucesso`,
      RevokeSessionUseCase.name,
    )
  }

  /**
   * Revoga todas as sessões associadas a um usuário.
   *
   * @param userId - ID do usuário cujas sessões serão revogadas.
   * @returns Uma Promise que é resolvida quando todas as sessões são revogadas.
   */
  async revokeAll(userId: number): Promise<void> {
    this.logger.debug(
      `Revogando todas as sessões para o usuário ${userId}`,
      RevokeSessionUseCase.name,
    )

    await this.sessionRepo.revokeAll(userId)

    this.logger.log(
      `Todas as sessões para o usuário ${userId} foram revogadas`,
      RevokeSessionUseCase.name,
    )
  }
}
