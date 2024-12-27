import { Callback, Method, Middleware, ResourceConfig, RouteConfig } from "src/types/route";
import CoreController from "./CoreController";
import { callbackList, callbackMethods } from "src/constants/express";
import CoreExpressRouter from "./CoreExpressRouter";
import { ControllerI } from "src/types/controller";

/**
 * Add a router resource
 * It could add basic Rest methods
 *
 * @param { Controller } handler Handler class
 * @param { string } resourceName Name of the resource
 * @param { RouteConfig } config Router configuration
 */
export default class CoreResourceRouter<Controller extends CoreController> {
  constructor(
    public config: ResourceConfig<Controller>,
    public apiVersion: string = '',
    public middlewares: Middleware[] = [],
  ) {}

  call() {
    const methods = this.methodList();
    this.createResource(methods);
  }

  methodList(): Callback[] {
    if (this.config.only) return this.config.only;
    return callbackList.filter(
      (name: Callback) => !this.config.exclude?.includes(name),
    );
  }

  /**
   * Loop over all callback methods and create routers
   *
   * @param {Callback[]} callbackNames Array of callback names
   */
  private createResource = (callbacks: Callback[]) => {
    for (const callback of callbacks) {
      const method = callbackMethods[callback];
      const path = this.getPath(method, callback);
      const { controller } = this.config;

      if (controller.prototype[callback] === undefined)
        throw this.methodNotImplemented(path, callback, controller);

      const config: RouteConfig<Controller> = {
        handler: callback as keyof Controller,
        path,
        method,
        controller,
        middlewares: [...this.middlewares, ...(this.config.middlewares || [])],
      };

      CoreExpressRouter.add(config);
    }
  };

  /**
   * Helper to create path based on
   * - resource name
   * - method
   * - callback name
   *
   * @param { Method } method Http method
   * @param { Callback } callbackName Friendly callback name
   *
   * @returns {string} Path
   */
  getPath = (method: Method, callbackName: Callback) => {
    const paths = [this.apiVersion, this.config.path, this.config.name].filter(
      i => i !== undefined,
    );

    /** GET:SHOW */
    if (method === Method.GET && callbackName === 'index')
      return CoreExpressRouter.getPath(...paths);

    switch (method) {
      case Method.POST:
        return CoreExpressRouter.getPath(...paths);

      case Method.GET:
      case Method.PUT:
      case Method.DELETE:
      case Method.PATCH:
        return CoreExpressRouter.getPath(...paths, ':id');

      default:
        throw new Error(`Method "${method}:${callbackName}" is not valid`);
    }
  };

  methodNotImplemented(
    path: string,
    callback: Callback,
    controller: ControllerI<Controller>,
  ) {
    const className = controller.name;
    return new Error(
      `Class '${className}' does not implement the method '${callback}'. Implement it to use the route '${path}' or exclude it from the resource configuration.`,
    );
  }
}
