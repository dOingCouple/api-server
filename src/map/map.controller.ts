import { Controller, Get, Render } from '@nestjs/common'

@Controller('map')
export class MapController {
  @Get()
  @Render('map')
  root() {
    return {
      message: 'Graphql Server',
    }
  }
}
