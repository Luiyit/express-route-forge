export enum ErrorName {
  App = 'App',
  Joi = 'Joi',
  Prisma = 'Prisma',
}

export enum HttpCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  InternalServerError = 500,
}
