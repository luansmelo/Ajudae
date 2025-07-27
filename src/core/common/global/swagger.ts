import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'

export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Ajudaê')
    .setDescription('API Ajudaê')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  )
}
