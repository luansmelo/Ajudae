import { Injectable, LoggerService, Inject } from '@nestjs/common'
import pino, { Logger as PinoLoggerType } from 'pino'
import pinoPretty from 'pino-pretty'
import { PinoLoggerOptions } from './interface'

type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal'

@Injectable()
export class PinoLogger implements LoggerService {
  private logger: PinoLoggerType

  constructor(@Inject('PinoLoggerOptions') options: PinoLoggerOptions) {
    const destination = options.pretty
      ? pinoPretty({ colorize: true, singleLine: true })
      : undefined

    this.logger = pino(
      {
        level: options.level,
        redact: options.redact,
      },
      destination,
    )
  }

  private logBase(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
    ...extra: any[]
  ) {
    this.logger[level](
      {
        context,
        trace,
        extra: extra.length ? extra : undefined,
      },
      typeof message === 'string' ? message : JSON.stringify(message),
    )
  }

  log(message: any, context?: string) {
    this.logBase('info', message, context)
  }

  error(message: any, trace?: string, context?: string) {
    this.logBase('error', message, context, trace)
  }

  warn(message: any, context?: string) {
    this.logBase('warn', message, context)
  }

  debug(message: any, context?: string) {
    this.logBase('debug', message, context)
  }

  verbose(message: any, context?: string) {
    this.logBase('trace', message, context)
  }

  fatal(message: any, context?: string) {
    this.logBase('fatal', message, context)
  }
}
