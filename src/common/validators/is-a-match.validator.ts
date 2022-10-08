import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsAMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsAMatchConstraint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAMatchConstraint,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'isAMatchConstraint' })
export class IsAMatchConstraint implements ValidatorConstraintInterface {
  validate(value: string | number, args: ValidationArguments): boolean {
    const [comparedProperty] = args.constraints;
    const relatedValue = (args.object as any)[comparedProperty];

    return value === relatedValue;
  }

  defaultMessage(args?: ValidationArguments): string {
    return 'Values do not match';
  }
}
