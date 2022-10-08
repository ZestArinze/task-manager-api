import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

export type CheckPermissionPayload = {
  userId: number;
  userIdFieldInSubject: string;
  subjectQueryOptions?: {
    tableName: string;
    colName: string;
    value: string | number;
  };

  subject?: Record<string, any>;
};

export const unauthorizedMessage =
  'You do not have the permission to peform to perform that action';

@Injectable()
export class BasicPermissionHelper {
  constructor(private readonly entityManager: EntityManager) {}

  async checkPermission(data: CheckPermissionPayload) {
    const { userId, userIdFieldInSubject, subjectQueryOptions, subject } = data;

    let passes = false;

    if (subjectQueryOptions) {
      const { tableName, colName, value } = subjectQueryOptions;

      if (!value) {
        throw new UnauthorizedException(unauthorizedMessage);
      }

      const record = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [colName]: value }) // ?
        .getOne();

      if (!record) {
        throw new NotFoundException();
      }

      passes =
        record &&
        record[userIdFieldInSubject] &&
        userId === record[userIdFieldInSubject];
    } else {
      passes = subject && userId === subject[userIdFieldInSubject];
    }

    if (!passes) {
      throw new UnauthorizedException(unauthorizedMessage);
    }
  }
}
