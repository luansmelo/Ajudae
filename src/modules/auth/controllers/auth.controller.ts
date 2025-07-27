import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { RevokeSessionUseCase } from '../usecases/revoke-session.usecase';
import { LoginUseCase } from '../usecases/login-usecase';
import { RefreshTokenUseCase } from '../usecases/refresh-token-usecase';
import { LoginDTO } from '../../../modules/dtos/login.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginResponseDTO } from 'src/modules/dtos/login.response.dto';
import { RevokeResponseDTO } from 'src/modules/dtos/revoke.dtto';

/**
 * Controller responsável por gerenciar autenticação e sessões de usuários.
 *
 * - Realiza login e gera tokens.
 * - Atualiza tokens expirados.
 * - Revoga refresh tokens (logout individual e de todas as sessões).
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly revokeSessionUseCase: RevokeSessionUseCase,
    ) { }

    /**
     * Realiza o login de um usuário e gera tokens de acesso e refresh.
     *
     * @route POST /auth/signin
     * @param body - Dados de autenticação (e-mail e senha).
     * @param req - Objeto da requisição (para capturar IP e User-Agent).
     * @returns Tokens de acesso e refresh.
     * @throws {UnauthorizedException} Caso as credenciais sejam inválidas.
     */
    @Post('signin')
    @ApiOperation({ summary: 'Login do usuário' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: LoginResponseDTO })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    async login(
        @Body() body: LoginDTO,
        @Request() req: any,
    ): Promise<LoginResponseDTO> {
        return this.loginUseCase.execute(body, req.ip, req.headers['user-agent']);
    }

    /**
     * Gera novos tokens de acesso e refresh usando um refresh token válido.
     *
     * @route POST /auth/refresh
     * @param refreshToken - Token de atualização válido.
     * @returns Novos tokens de acesso e refresh.
     * @throws {UnauthorizedException} Caso o refresh token seja inválido ou expirado.
     */
    @Post('refresh')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Renova tokens de acesso' })
    @ApiResponse({ status: 200, description: 'Tokens renovados com sucesso', type: LoginResponseDTO })
    @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
    async refresh(@Body('refreshToken') refreshToken: string): Promise<LoginResponseDTO> {
        return this.refreshTokenUseCase.execute(refreshToken);
    }

    /**
     * Revoga um refresh token específico, invalidando a sessão correspondente.
     *
     * @route POST /auth/logout
     * @param refreshToken - Token de atualização que deve ser revogado.
     * @returns Confirmação do logout.
     * @throws {UnauthorizedException} Caso o token seja inválido.
     */
    @Post('logout')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Revoga um refresh token' })
    @ApiResponse({ status: 200, description: 'Logout realizado com sucesso', type: RevokeResponseDTO })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async logout(@Body('refreshToken') refreshToken: string): Promise<RevokeResponseDTO> {
        await this.revokeSessionUseCase.execute(refreshToken);
        return { success: true };
    }

    /**
     * Revoga todos os refresh tokens associados ao usuário logado.
     *
     * @route POST /auth/logout/all
     * @param req - Objeto da requisição (contém o userId do token JWT).
     * @returns Confirmação da revogação de todas as sessões.
     * @throws {UnauthorizedException} Caso o token JWT seja inválido.
     */
    @Post('logout/all')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Revoga todos os refresh tokens do usuário' })
    @ApiResponse({ status: 200, description: 'Logout de todas as sessões realizado com sucesso', type: RevokeResponseDTO })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async logoutAll(@Request() req: any): Promise<RevokeResponseDTO> {
        await this.revokeSessionUseCase.revokeAll(req.user.userId);
        return { success: true };
    }
}
