import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsPasswordWorthy(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordWorthyConstraint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordWorthyConstraint,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'isPasswordWorthyConstraint' })
export class IsPasswordWorthyConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    // ^                         Start anchor
    // (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters.
    // (?=.*[!@#$&*])            Ensure string has one special case letter.
    // (?=.*[0-9].*[0-9])        Ensure string has two digits.
    // (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
    // .{8}                      Ensure string is of length 8.
    // $                         End anchor.

    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

    return regex.test(value);
  }

  defaultMessage(args?: ValidationArguments): string {
    return `Password is weak. Use combination of upper case, lower case, number and special character`;
  }
}
