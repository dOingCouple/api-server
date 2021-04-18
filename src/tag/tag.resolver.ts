import { Resolver, Query } from '@nestjs/graphql'
import { TagService } from './tag.service'
import { Tag } from './schemas/tag.schema'

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tag], { name: 'tag' })
  findAll() {
    return this.tagService.findAll()
  }
}
