import { StatusCodes } from 'http-status-codes'

export default class InternalError extends Error {
  status: number

  constructor(message: string) {
    super(message)
    this.status = StatusCodes.INTERNAL_SERVER_ERROR
  }
}
