import { ObjectType } from '@nestjs/graphql'
import { Paginated } from '~/common/dto/page-pagination.out'
import { User } from '../schemas/user.schema'

@ObjectType()
export class PaginatedUser extends Paginated(User) {}
