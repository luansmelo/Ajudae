import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PinoLogger } from './logger.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'PinoLoggerOptions',
            useFactory: (configService: ConfigService) => ({
                level: configService.get<string>('LOG_LEVEL', 'info'),
                redact: ['req.headers.authorization'],
                pretty: configService.get<string>('NODE_ENV') !== 'production',
            }),
            inject: [ConfigService],
        },
        PinoLogger,
    ],
    exports: [PinoLogger],
})
export class LoggerModule { }
