import Conflict from '@/utils/errors/Conflict'
import NotFound from '@/utils/errors/NotFound'

export class DuplicateRecordError extends Conflict {
  constructor() {
    super(`Duplicate record`)
    this.name = 'DuplicateRecordError'
  }
}

export class MessageNotFound extends NotFound {
  constructor(message = 'Message not found') {
    super(message)
  }
}
