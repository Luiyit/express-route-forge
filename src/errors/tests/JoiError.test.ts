import JoiError from '../JoiError';
import { ErrorName, HttpCode } from 'src/types/errors';

describe('JoiError', () => {
  it('should create an instance of JoiError with the correct properties', () => {
    const message = 'Validation error';
    const details = { field: 'Field is required' };
    const error = new JoiError(message, details);

    expect(error.message).toBe(message);
    expect(error.name).toBe(ErrorName.Joi);
    expect(error.details).toBe(details);
    expect(error.code).toBe(HttpCode.UnprocessableEntity);
  });

  it('should create an instance of AppError with custom values', () => {
    const message = 'Validation error';
    const details = { field: 'Field is required' };
    const error = new JoiError(message, details, HttpCode.BadRequest);

    expect(error.code).toEqual(HttpCode.BadRequest);
  });
});