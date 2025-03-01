import ErrorListener, { handlerError } from '../catchValidationError';
import AppError from '../../errors/AppError';

class MockHandler {
  knowErrorHandler = jest.fn();
  unknownErrorHandler = jest.fn();
}

class ChildHandler extends MockHandler {
  @ErrorListener
  fireAppError() {
    throw new AppError('Test error');
  }

  @ErrorListener
  fireError() {
    throw new Error('Test error');
  }
}

describe('catchValidationError', () => {
  describe('handlerError', () => {
    let mockHandler: MockHandler;

    beforeEach(() => {
      mockHandler = new MockHandler();
    });

    it('should call knowErrorHandler if error is an instance of AppError', () => {
      const error = new AppError('Test error');
      handlerError(mockHandler, error);
      expect(mockHandler.knowErrorHandler).toHaveBeenCalledWith(error);
    });

    it('should call unknownErrorHandler if error is not an instance of AppError', async () => {
      const error = new Error('Test error');
      await handlerError(mockHandler, error);
      expect(mockHandler.unknownErrorHandler).toHaveBeenCalledWith(error);
    });

    it('should throw error if no handler is available', () => {
      const error = new Error('Test error');
      expect(() => handlerError({}, error)).toThrow(error);
    });
  });

  describe('ErrorListener', () => {
    let childHandler: ChildHandler;

    beforeEach(() => {
      childHandler = new ChildHandler();
    });

    it('should call knowErrorHandler if class throw an AppError', () => {
      childHandler.fireAppError()
      expect(childHandler.knowErrorHandler).toHaveBeenCalled();
    });
    
    it('should call unknownErrorHandler if class throw an Error', () => {
      childHandler.fireError()
      expect(childHandler.unknownErrorHandler).toHaveBeenCalled();
    });
  });
});