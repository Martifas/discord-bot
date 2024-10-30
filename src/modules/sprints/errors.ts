import NotFound from '@/utils/errors/NotFound'
import BadRequest from '@/utils/errors/BadRequest'
import Conflict from '@/utils/errors/Conflict'

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

export class DuplicateSprintCodeError extends Conflict {
  constructor(sprintCode: string) {
    super(`Sprint with code "${sprintCode}" already exists`)
    this.name = 'DuplicateSprintCodeError'
  }
}
