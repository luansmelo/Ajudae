// src/shared/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from 'src/core/domain/erros/domain-exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'Internal Server Error';
        let message = 'An unexpected error occurred';
        let details: any = {};

        if ((exception as any).code && (exception as any).status && typeof (exception as any).message === 'string') {
            const domainException = exception as DomainException;
            status = domainException.status;
            error = domainException.code;
            message = domainException.message;
            details = domainException.details || {};
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            error = exception.name;
            message = exception.message;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(status).json({
            statusCode: status,
            error,
            message,
            details,
        });
    }
}