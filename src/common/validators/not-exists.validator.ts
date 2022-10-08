import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';

export interface NotExistsConstraintInput {
  table: string;
  col: string;
  inputProperty?: string | number;
}

export interface NotExistsValidationOptions extends ValidationOptions {
  context: NotExistsConstraintInput;
}

export function NotExists(validationOptions: NotExistsValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'NotExistsConstraint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions.context],
      validator: NotExistsConstraint,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'notExistsConstraint', async: true })
export class NotExistsConstraint implements ValidatorConstraintInterface {
  private message: string;

  constructor(private readonly entityManager: EntityManager) {
    this.message = 'The selected record already exists';
  }

  async validate(
    value: string | number,
    args: ValidationArguments,
  ): Promise<boolean> {
    const { table, col, inputProperty } = args
      .constraints[0] as NotExistsConstraintInput;

    const valueToFind = args.object[inputProperty];

    try {
      const data = await this.entityManager
        .getRepository(table)
        .createQueryBuilder(table)
        .where({ [col]: valueToFind })
        .getOne();

      if (!data) {
        return true;
      }

      this.message = `The selected ${inputProperty} already exists`;

      return false;
    } catch (error) {
      this.message = `Something went wrong`;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return this.message;
  }
}
