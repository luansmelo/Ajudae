import { HttpStatus } from '@nestjs/common'
import { DomainException } from './domain-exception'

export class EmailAlreadyInUseException
  extends Error
  implements DomainException
{
  readonly code = 'EMAIL_ALREADY_IN_USE'
  readonly status = HttpStatus.CONFLICT
  readonly details?: any

  constructor(details?: any) {
    super(`O e-mail já está cadastrado`)
    this.name = 'EmailAlreadyInUseException'
    if (details) {
      this.details = details
    }
  }
}
