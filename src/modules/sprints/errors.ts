import NotFound from '@/utils/errors/NotFound'
import BadRequest from '@/utils/errors/BadRequest'

export class SprintNotFound extends NotFound {
  constructor(message = 'Sprint not found') {
    super(message)
  }
}

export class CantUpdateSprint extends BadRequest {
  constructor(message = 'Cannot update sprint') {
    super(message)
  }
}
