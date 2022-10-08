export const typeormPartialMock = {
  createQueryBuilder: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),

  addSelect: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),

  execute: jest.fn().mockReturnValue({ affected: 1 }),
  delete: jest.fn().mockReturnValue({ affected: 1 }),
};
