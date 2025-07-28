import { HttpStatus } from '@nestjs/common'
import { DomainException } from './domain-exception'

export class TeamNameAlreadyInUseException
  extends Error
  implements DomainException
{
  readonly code = 'TEAM_NAME_ALREADY_IN_USE'
  readonly status = HttpStatus.CONFLICT
  readonly details?: any

  constructor(details?: any) {
    super(`O nome do time já está cadastrado`)
    this.name = 'TeamNameAlreadyInUseException'
    if (details) {
      this.details = details
    }
  }
}
