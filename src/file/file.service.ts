import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  DefaultRequestSigner,
  HttpRequest,
  ConfigFileAuthenticationDetailsProvider,
} from 'oci-common'
import { from, of, throwError } from 'rxjs'
import { flatMap, map } from 'rxjs/internal/operators'
import { randomString } from '~/common/utils/random'
import { OracleObjectStorage } from '~/config/types/env.types'
import { FileListOut } from './dto/file-list.out'

@Injectable()
export class FileService {
  private signer: () => DefaultRequestSigner
  private properties: OracleObjectStorage

  constructor(private readonly configService: ConfigService) {
    this.properties = configService.get('oracle.objectStorage')
    this.signer = () =>
      new DefaultRequestSigner(
        new ConfigFileAuthenticationDetailsProvider(
          this.properties.configFilePath
        )
      )
  }

  findObject(): Promise<FileListOut> {
    const httpRequest: HttpRequest = {
      uri: `${this.properties.baseUrl}/n/${this.properties.namespace}/b/${this.properties.bucketName}/o`,
      headers: new Headers(),
      method: 'GET',
    }

    return from(this.signer().signHttpRequest(httpRequest))
      .pipe(
        flatMap(() =>
          fetch(
            new Request(httpRequest.uri, {
              method: httpRequest.method,
              headers: httpRequest.headers,
              body: httpRequest.body,
            })
          )
        ),
        flatMap((res) => res.json()),
        map((body) => ({
          content: JSON.stringify(body.objects),
        }))
      )
      .toPromise()
  }

  uploadObject(file: Express.Multer.File) {
    const headers = new Headers()
    headers.append('Content-Type', file.mimetype)
    headers.append('Content-Length', String(file.buffer.length))

    const extensionName = file.originalname.substr(
      file.originalname.lastIndexOf('.'),
      file.originalname.length
    )

    const httpRequest: HttpRequest = {
      uri: `${this.properties.baseUrl}/n/${this.properties.namespace}/b/${
        this.properties.bucketName
      }/o/profile/${randomString()}${extensionName}`,
      headers,
      method: 'PUT',
    }

    return from(this.signer().signHttpRequest(httpRequest))
      .pipe(
        flatMap(() =>
          fetch(
            new Request(httpRequest.uri, {
              method: httpRequest.method,
              headers: httpRequest.headers,
              body: file.buffer,
            })
          )
        ),
        flatMap((res) => {
          if (res.status === 200) {
            return of(res.url)
          }
          return throwError(new InternalServerErrorException())
        })
      )
      .toPromise()
  }
}
