import { Inject, Injectable } from "@nestjs/common";
import { PinoLogger } from "../../../core/common/logger/logger.service";
import { UserNotFoundExpection } from "../../../core/domain/erros/user-not-found.exception";
import { UserRepository } from "../../../core/domain/repositories/user.repository";
import { createSingleResponse } from "../../../shared/utils/response.utils";
import { REPOSITORY_TOKENS } from "../../../shared/utils/tokens";

/**
 * Caso de uso responsável por carregar um usuário pelo ID.
 *
 * - Busca o usuário no repositório.
 * - Lança exceção caso não seja encontrado.
 * - Retorna os dados do usuário em uma resposta padronizada.
 */
@Injectable()
export class LoadUserByIdUseCase {
    constructor(
        @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
        private readonly repository: UserRepository,
        private readonly logger: PinoLogger
    ) { }

    /**
     * Executa a busca de um usuário pelo ID.
     *
     * @param id - Identificador único do usuário.
     * @returns Um objeto padronizado contendo os dados do usuário.
     * @throws {UserNotFoundExpection} Caso o usuário não seja encontrado.
     */
    async execute(id: number) {
        this.logger.debug(
            `Iniciando carregamento do usuário com ID: ${id}`,
            LoadUserByIdUseCase.name
        );

        const user = await this.repository.findById(id);

        this.logger.debug(
            `Usuário encontrado: ${user?.email}`,
            LoadUserByIdUseCase.name
        );

        if (!user) throw new UserNotFoundExpection();

        this.logger.log(
            `Usuário carregado com sucesso: ${user.email}`,
            LoadUserByIdUseCase.name
        );

        return createSingleResponse(user);
    }
}
