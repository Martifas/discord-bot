import Conflict from '@/utils/errors/Conflict'
import InternalError from '@/utils/errors/InternalError'
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

export class CourseNotFound extends NotFound {
  constructor(message = 'Course not found') {
    super(message)
  }
}

export class TemplateFailedFetch extends InternalError {
  constructor(message = 'Failed to fetch template') {
    super(message)
  }
}
