import { Controller, Get } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { createWriteStream } from 'fs'
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { FileListOut } from './dto/file-list.out'
import { FileService } from './file.service'

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Query(() => FileListOut, { name: 'findObject' })
  findObject(): Promise<FileListOut> {
    return this.fileService.findObject()
  }
}
