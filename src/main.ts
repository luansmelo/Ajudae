import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'
import { PinoLogger } from './core/common/logger/logger.service'
import { configureSwagger } from './core/common/global/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const logger = app.get(PinoLogger)

  app.useLogger(logger)
  configureSwagger(app)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(process.env.PORT ?? 3000)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
