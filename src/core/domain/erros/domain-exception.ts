import { HttpStatus } from '@nestjs/common';

export interface DomainException {
    readonly code: string;
    readonly status: HttpStatus;
    readonly message: string;
    readonly details?: any;
}