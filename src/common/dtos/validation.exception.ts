import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: Record<string, any>) {
    super(
      {
        successful: false,
        message: 'Validation not passed',
        error: errors,
        data: null,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
