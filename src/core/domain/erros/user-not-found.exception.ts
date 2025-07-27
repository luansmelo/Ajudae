import { HttpStatus } from '@nestjs/common'
import { DomainException } from './domain-exception'

export class UserNotFoundException extends Error implements DomainException {
  readonly code = 'USER_NOT_FOUND'
  readonly status = HttpStatus.CONFLICT
  readonly details?: any

  constructor(details?: any) {
    super(`O usuário não foi encontrado`)
    this.name = 'UserNotFoundException'
    if (details) {
      this.details = details
    }
  }
}
