import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';

export interface ExistsConstraintInput {
  table: string;
  col: string;
  inputProperty?: string | number;
}

export interface ExistsValidationOptions extends ValidationOptions {
  context: ExistsConstraintInput;
}

export function Exists(validationOptions: ExistsValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ExistsConstraint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions.context],
      validator: ExistsConstraint,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'existsConstraint', async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
  private message = 'A record for this input does not exist';

  constructor(private entityManager: EntityManager) {}

  async validate(
    value: string | number,
    args: ValidationArguments,
  ): Promise<boolean> {
    const { table, col, inputProperty } = args
      .constraints[0] as ExistsConstraintInput;

    const valueToFind = args.object[inputProperty];

    try {
      const data = await this.entityManager
        .getRepository(table)
        .createQueryBuilder(table)
        .where({ [col]: valueToFind })
        .getOne();

      if (data) {
        return true;
      }

      this.message = `The selected ${inputProperty} does not exist`;
      return false;
    } catch (error) {
      this.message = `Something went wrong`;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return this.message;
  }
}
