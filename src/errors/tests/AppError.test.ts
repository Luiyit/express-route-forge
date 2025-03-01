import AppError from '../AppError';
import { ErrorName, HttpCode } from '../../types/errors';

describe('AppError', () => {
  it('should create an instance of AppError with default values', () => {
    const error = new AppError('An error occurred');

    expect(error.message).toBe('An error occurred');
    expect(error.name).toBe(ErrorName.App);
    expect(error.details).toEqual({});
    expect(error.code).toBe(HttpCode.UnprocessableEntity);
  });

  it('should create an instance of AppError with custom values', () => {
    const customDetails = { key: 'value' };
    const error = new AppError('Custom error', 'MongoDB', customDetails, HttpCode.BadRequest);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Custom error');
    expect(error.name).toBe('MongoDB');
    expect(error.details).toEqual(customDetails);
    expect(error.code).toBe(HttpCode.BadRequest);
  });
});