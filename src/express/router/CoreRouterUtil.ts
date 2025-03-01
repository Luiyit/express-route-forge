import { ResourceConfig, RouteConfig } from "../../types/route";
import CoreController from "./CoreController";
import CoreRouter from "./CoreRouter";

/**
 * To create a simple router you only need to use
 * new CoreRouter<YourController>('api/v1', [middlewares])
 *
 * For each router you need to to this
 * If you want to use the same router params to all routes is not useful
 *
 * To improve this flow, you can create a custom CoreRouter
 * and pass it to CoreRouterUtil.single or CoreRouterUtil.resource
 *
 * With that, you can encapsulate your api version and middlewares
 *
 * The goals are:
 * - Avoid passing the same params to all routes and
 * - Don't need to instantiate a new CoreRouter for each route
 * 
 * 
 * > Global static class example
 * 
 * export default class PublicRouterUtil {
 *   public static single<ChildController extends CoreController>(
 *     config: RouteConfig<ChildController>,
 *   ){
 *     const publicRouter = new PublicRouter<ChildController>();
 *     CoreRouterUtil.single(config, publicRouter);
 *   }

 *   public static resource<ChildController extends CoreController>(
 *     config: ResourceConfig<ChildController>,
 *   ){
 *     const publicRouter = new PublicRouter<ChildController>();
 *     CoreRouterUtil.resource(config, publicRouter);
 *   }
 * }
 * 
 * 
 * > How to use 
 * 
 * PublicRouterUtil.single({
 *   handler: 'login',
 *   method: Method.POST,
 *   path: 'auth/login',
 *   controller: SessionsController,
 * });

 */
export default class CoreRouterUtil {
  public static single<
    ChildController extends CoreController,
    ChildCoreRouter extends CoreRouter<ChildController>,
  >(config: RouteConfig<ChildController>, router: ChildCoreRouter) {
    router.single(config);
  }

  public static resource<
    ChildController extends CoreController,
    ChildCoreRouter extends CoreRouter<ChildController>,
  >(config: ResourceConfig<ChildController>, router: ChildCoreRouter) {
    router.resource(config);
  }
}
