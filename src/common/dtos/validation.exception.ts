import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: Record<string, any>) {
    super(errors, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
