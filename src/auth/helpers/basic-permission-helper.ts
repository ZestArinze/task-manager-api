import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class BasicPermissionHelper {
  private message =
    'You do not have the permission to peform to perform that action';
  constructor(private readonly entityManager: EntityManager) {}

  async checkPermission(data: {
    userId: number;
    userIdFieldInSubject: string;
    subjectQueryOptions?: {
      tableName: string;
      colName: string;
      value: string | number;
    };

    subject?: Record<string, any>;
  }) {
    const { userId, userIdFieldInSubject, subjectQueryOptions, subject } = data;

    let passes = false;

    if (subjectQueryOptions) {
      const { tableName, colName, value } = subjectQueryOptions;
      if (!value) {
        throw new UnauthorizedException(this.message);
      }

      const record = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [colName]: value }) // ?
        .getOne();

      passes =
        record &&
        record[userIdFieldInSubject] &&
        userId === record[userIdFieldInSubject];
    } else {
      passes = subject && userId === subject[userIdFieldInSubject];
    }

    if (!passes) {
      throw new UnauthorizedException(this.message);
    }
  }
}
