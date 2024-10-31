import Conflict from '@/utils/errors/Conflict'
import NotFound from '@/utils/errors/NotFound'

export class DuplicateTemplateIdError extends Conflict {
  constructor(template: string) {
    super(`Template "${template}" already exists`)
    this.name = 'DuplicateTemplateError'
  }
}

export class TemplateNotFound extends NotFound {
  constructor(message = 'Template not found') {
    super(message)
  }
}
