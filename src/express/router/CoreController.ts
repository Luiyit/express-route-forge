import { NextFunction, Request, Response } from 'express';
import CoreResponse from './CoreResponse';
import { CoreHandler } from '../../types/controller';
import ErrorListener from '../../decorators/catchValidationError';
import AppError from '../../errors/AppError';

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
   * You can create your custom errors and extends from IAppError.
   *
   * If you want to change this behavior, you need to override the handlerError method
   *
   * @param error AppError error instance
   */
  public async knowErrorHandler(error: AppError) {
    if(error instanceof AppError)
      return this.response.error(
        error.message,
        error.code,
        error.name,
        error.details,
      );

    this.unknownErrorHandler(error);
  }

  /**
   * Handler unknown errors into your controller.
   * Default behavior is to throw the error again
   * 
   * @param error Unknown error
   */
  protected async unknownErrorHandler(error: unknown): Promise<void> {
    throw error;
  }

  /**
   * Controller util method to configure child behavior
   * when an async method is needed
   *
   * @returns {Promise<void>}
   */
  protected async initialize() {}

  get body(){
    return this.req.body;
  }
  
  get query(){
    return this.req.query;
  }
  
  get params(){
    return this.req.params;
  }
}
