import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SessionRepository } from 'src/core/domain/repositories/session.repository';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from 'src/shared/utils/tokens';
import { Session } from 'src/core/domain/entities/session.entity';
import { LoginDTO } from 'src/modules/auth/dtos/login.dto';
import { ONE_WEEK_IN_MS } from '../constants/constants';
import { UserRepository } from 'src/core/domain/repositories/user.repository';
import { PasswordEncryptor } from 'src/core/domain/interfaces/password-encryptor.interface';
import { PinoLogger } from 'src/core/common/logger/logger.service';
import { LoginResponseDTO } from 'src/modules/auth/dtos/login.response.dto';

/**
 * Caso de uso responsável pelo login do usuário.
 *
 * @class LoginUseCase
 */
@Injectable()
export class LoginUseCase {
    constructor(
        private readonly authService: AuthService,
        @Inject(REPOSITORY_TOKENS.SESSION_REPOSITORY)
        private readonly sessionRepo: SessionRepository,
        @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(SERVICE_TOKENS.PASSWORD_ENCRYPTOR)
        private readonly passwordEncryptor: PasswordEncryptor,
        private readonly logger: PinoLogger
    ) { }

    /**
     * Executa o fluxo de login:
     * - Valida credenciais do usuário
     * - Gera tokens (access e refresh)
     * - Cria a sessão
     * - Atualiza a data do último login
     *
     * @param dto Dados do login (email e senha).
     * @param ip Endereço IP da requisição.
     * @param userAgent User-Agent do cliente.
     * @returns Um objeto contendo accessToken e refreshToken.
     * @throws UnauthorizedException Caso as credenciais sejam inválidas.
     */
    async execute(dto: LoginDTO, ip: string, userAgent: string): Promise<LoginResponseDTO> {
        this.logger.debug(`Tentando login para ${dto.email}`, LoginUseCase.name);

        const user = await this.userRepository.findByEmail(dto.email);
        if (!user || !(await this.passwordEncryptor.comparePassword(dto.password, user.password))) {
            this.logger.warn(`Falha de login para ${dto.email}`, LoginUseCase.name);
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.authService.generateAccessToken(user.id!, user.email, user.role!);
        const refreshToken = this.authService.generateRefreshToken();

        const expiresAt = new Date(Date.now() + ONE_WEEK_IN_MS);
        const session = new Session(null, user.id!, ip, userAgent, refreshToken, expiresAt);

        await this.sessionRepo.create(session);
        await this.authService.updateUserLastLogin(user.id!);

        this.logger.log(`Usuário ${user.email} logado com sucesso`, LoginUseCase.name);

        return { accessToken, refreshToken };
    }
}
