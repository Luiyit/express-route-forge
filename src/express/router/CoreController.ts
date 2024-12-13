import { NextFunction, Request, Response } from 'express';
import CoreResponse from './CoreResponse';
import { CoreHandler } from 'src/types/controller';
import ErrorListener from 'src/decorators/catchValidationError';
import AppError from 'src/errors/AppError';
import { ErrorName } from 'src/types/errors';
// import { CoreHandler } from '@libTypes/controller';
// import CoreResponse from '@express/router/CoreResponse';
// import ErrorListener from '@decorators/catchValidationError';
// import AppError from '@errors/AppError';
// import { ErrorName } from '@libTypes/errors';

export default class CoreController {
  /**
   * Response instance
   * Core util to handler error and success responses
   */
  public response: CoreResponse;

  constructor(
    public req: Request,
    public res: Response,
    public next: NextFunction,
    public handler: CoreHandler,
  ) {
    this.response = new CoreResponse(res, req, next);
  }

  /**
   * Method to be called by the route
   * This method is decorated with ErrorListener
   */
  @ErrorListener
  public async call() {
    await this.initialize();

    /**
     * DEV NOTE:
     * Name is validated in the route registration
     * name keyof ChildCOntroller extends CoreController
     */
    const method = this[this.handler.name as keyof this];
    if (typeof method === 'function') {
      return await method.bind(this).call();
    }

    throw new AppError(`${String(this.handler.name)} is not a callable method`);
  }

  /**
   * Controller util method to send a response with the error
   * You can create your custom errors and extends from IAppError
   * Keep in mind if the error.name is not defined, the error will be forwarded again.
   *
   * For custom errors. you need to override the handlerError method
   * the default case is the super implementation
   *
   * @param error AppError error instance
   */
  public async handlerError(error: AppError) {
    switch (error.name) {
      case ErrorName.App:
      case ErrorName.Joi:
        this.response.error(
          error.message,
          error.code,
          error.name,
          error.details,
        );
        break;

      default:
        throw error;
    }
  }

  /**
   * Controller util method to configure child behavior
   * when an async method is needed
   *
   * @returns {Promise<void>}
   */
  protected async initialize() {}
}
