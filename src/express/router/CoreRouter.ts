// import CoreController from '@express/router/CoreController';
// import CoreExpressRouter from '@express/router/CoreExpressRouter';
// import { Middleware, ResourceConfig, RouteConfig } from '@libTypes/route';
import { Middleware, ResourceConfig, RouteConfig } from 'src/types/route';
import CoreController from './CoreController';
import CoreResourceRouter from './CoreResourceRouter';
import CoreExpressRouter from './CoreExpressRouter';

/**
 * Create an app router configuration
 *
 * @param { string } apiVersion api version path
 * @param { Middleware[] } Middlewares array of middlewares
 */
export default class CoreRouter<Controller extends CoreController> {
  constructor(
    public apiVersion: string = '',
    public middlewares: Middleware[] = [],
  ) {}

  single(config: RouteConfig<Controller>) {
    const path = CoreExpressRouter.getPath(this.apiVersion, config.path);
    CoreExpressRouter.add({
      ...config,
      path,
      middlewares: [...this.middlewares, ...(config.middlewares || [])],
    });
  }

  resource(config: ResourceConfig<Controller>) {
    new CoreResourceRouter(config, this.apiVersion, this.middlewares).call();
  }
}
