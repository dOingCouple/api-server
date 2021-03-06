import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express'
import { join } from 'path'
import { readFileSync } from 'fs'
import express, { Express } from 'express'
import http from 'http'
import https from 'https'
import { AppModule } from './app.module'
import { Environment } from './config/types/env.types'
import { ValidationPipe } from '@nestjs/common'

function middlewareHttpsRedirect(
  server: Express,
  configService: ConfigService
) {
  server.use((req, res, next) => {
    if (!req.secure) {
      res.redirect(
        `https://${req.hostname}:${configService.get<number>(
          'server.https.port'
        )}${req.url}`
      )
      return
    }
    next()
  })
}

async function bootstrap() {
  const server = express()
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server)
  )
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs')

  middlewareHttpsRedirect(server, configService)

  await app.init()

  http
    .createServer(server)
    .listen(configService.get<number>('server.http.port'))

  https
    .createServer(
      {
        key: readFileSync(
          configService.get('NODE_ENV') === Environment.Local
            ? join(
                __dirname,
                configService.get<string>('server.ssl.privkeyPath')
              )
            : configService.get<string>('server.ssl.privkeyPath')
        ),
        cert: readFileSync(
          configService.get('NODE_ENV') === Environment.Local
            ? join(__dirname, configService.get<string>('server.ssl.pubPath'))
            : configService.get<string>('server.ssl.pubPath')
        ),
      },
      server
    )
    .listen(configService.get<number>('server.https.port'))
}
bootstrap()
