import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Controlador principal da aplicação.
 * Fornece um endpoint de healthcheck para verificar se a API está funcionando corretamente.
 */
@ApiTags('System')
@Controller()
export class AppController {
  /**
   * Endpoint de healthcheck para verificar se a API está funcionando.
   *
   * @route GET /healthcheck
   * @returns Objeto com status, uptime e timestamp da API.
   */
  @Get('healthcheck')
  @ApiOperation({ summary: 'Verifica o estado da API (Healthcheck)' })
  @ApiResponse({
    status: 200,
    description: 'API funcionando corretamente',
    schema: {
      example: {
        status: 'ok',
        uptime: 123.45,
        timestamp: '2025-07-27T20:00:00.000Z',
      },
    },
  })
  healthcheck() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
