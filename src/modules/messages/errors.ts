import Conflict from '@/utils/errors/Conflict'

export class DuplicateRecordError extends Conflict {
  constructor() {
    super(`Duplicate record`)
    this.name = 'DuplicateRecordError'
  }
}
