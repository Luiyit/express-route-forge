import {
  Router as expressRouter,
  NextFunction,
  Request,
  Response,
} from 'express';
import CoreController from './CoreController';
import { Method, RouteConfig, RouterArgs } from '../../types/route';
import { ControllerI, CoreHandler } from '../../types/controller';

export default class CoreExpressRouter {
  /**
   * Define a instance express router resource
   * It could add basic Rest methods
   */
  public static expressRouter = expressRouter();

  public static getPath(...args: string[]): string {
    const path = [...args.filter(s => !!s)].join('/');
    return path.startsWith('/') ? path : `/${path}`;
  }

  public static add<Controller extends CoreController>(
    config: RouteConfig<Controller>,
  ) {
    const { controller, handler, method, path, middlewares } = config;

    if (!method) throw new Error('Method is not valid');

    const coreHandler: CoreHandler = {
      name: handler,
    };

    /** Update types */
    const args: RouterArgs<string> = [
      path,
      ...(middlewares || []),
      this.createHandler(controller, coreHandler)
    ];

    switch (method) {
      case Method.GET:
        this.logInfo(`⚓ Router \x1b[32m[GET] ${path}\x1b[0m added`);
        this.expressRouter.get(...args);
        break;
        
      case Method.POST:
        this.logInfo(`⚓ Router \x1b[32m[POST] ${path}\x1b[0m added`);
        this.expressRouter.post(...args);
        
        break;
        
      case Method.PUT:
        this.logInfo(`⚓ Router \x1b[32m[PUT] ${path}\x1b[0m added`);
        this.expressRouter.put(...args);
        break;

      case Method.DELETE:
        this.logInfo(`⚓ Router \x1b[32m[DELETE] ${path}\x1b[0m added`);
        this.expressRouter.delete(...args);
        break;

      case Method.PATCH:
        this.logInfo(`⚓ Router \x1b[32m[PATCH] ${path}\x1b[0m added`);
        this.expressRouter.patch(...args);
        break;

      default:
        throw new Error(`Method "${method}" is not valid`);
    }
  }

  /**
   * Generator function to create a handler
   *
   * @param {Class} handler Handler class
   * @param {hash} config Router configuration
   *
   * @returns { function } Handler function with the handler class
   */
  public static createHandler =
    <Controller extends CoreController>(
      controller: ControllerI<Controller>,
      handler: CoreHandler,
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const instance = new controller(req, res, next, handler);
      await instance.call();
    };

  private static logInfo(message: string): void {
    if (!process.env.JEST_WORKER_ID) console.info(message);
  }
}
