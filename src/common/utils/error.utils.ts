import { ValidationError } from '@nestjs/common';

export const formatValidationError = (exception: ValidationError[] = []) => {
  const errors: Record<string, any> = {};

  for (const item of exception) {
    errors[item.property] = Object.values(item.constraints);
  }

  return errors;
};
