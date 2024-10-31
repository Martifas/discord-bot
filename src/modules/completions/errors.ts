import Conflict from '@/utils/errors/Conflict'
import NotFound from '@/utils/errors/NotFound'

export class DuplicateCompletionError extends Conflict {
  constructor() {
    super(`Duplicate completion already exists`)
    this.name = 'DuplicateSprintCodeError'
  }
}

export class CompletionNotFound extends NotFound {
  constructor(message = 'Completion not found') {
    super(message)
  }
}
