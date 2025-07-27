import { HttpStatus } from '@nestjs/common';
import { DomainException } from './domain-exception';

export class UserNotFoundExpection extends Error implements DomainException {
    readonly code = 'USER_NOT_FOUND';
    readonly status = HttpStatus.CONFLICT;

    constructor() {
        super(`O usuário não foi encontrado`);
        this.name = 'UserNotFound';
    }
}