import Conflict from '@/utils/errors/Conflict'

export class DuplicateTemplateIdError extends Conflict {
  constructor(template: string) {
    super(`Template "${template}" already exists`)
    this.name = 'DuplicateTemplateError'
  }
}
