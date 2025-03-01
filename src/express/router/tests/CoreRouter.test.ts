import "../../../mocks/express";
jest.mock('../CoreExpressRouter');
jest.mock('../CoreResourceRouter');

import CoreRouter from '../CoreRouter';
import CoreExpressRouter from '../CoreExpressRouter';
import { Method, Middleware, ResourceConfig, RouteConfig } from '../../../types/route';
import CoreController from '../CoreController';
import CoreResourceRouter from "../CoreResourceRouter";

class MockController extends CoreController {
  async index() {}
}

let router: CoreRouter<MockController>;
function createRouter(apiVersion: string = 'v1', middlewares: Middleware[] = []){
  router = new CoreRouter<MockController>(apiVersion, middlewares);
}

describe('CoreRouter', () => {
  describe('constructor', () => {
    it('should initialize with default values', () => {
      const router = new CoreRouter();
      expect(router.apiVersion).toBe('');
      expect(router.middlewares).toEqual([]);
    });

    it('should initialize with provided apiVersion and middlewares', () => {
      const apiVersion = 'v1';
      const middlewares: Middleware[] = [jest.fn(), jest.fn()];
      const router = new CoreRouter(apiVersion, middlewares);
      expect(router.apiVersion).toBe(apiVersion);
      expect(router.middlewares).toBe(middlewares);
    });
  });

  describe('single', () => {
    const config: RouteConfig<MockController> = {
      controller: MockController,
      handler: 'index',
      method: Method.GET,
      path: '/mock',
      middlewares: [jest.fn()],
    };
        
    it('should add a route with the correct path and middlewares', () => {
      const middlewares: Middleware[] = [jest.fn(), jest.fn()]
      createRouter('v1', middlewares);
      router.single(config);

      expect(CoreExpressRouter.getPath).toHaveBeenCalledWith('v1', config.path);
      expect(CoreExpressRouter.add).toHaveBeenCalledWith({
        ...config,
        path: CoreExpressRouter.getPath('v1', config.path),
        middlewares: [...middlewares, ...(config.middlewares || [])],
      });
    });
  });
  
  describe('resource', () => {
    const config: ResourceConfig<MockController> = {
      name: 'mock',
      path: '',
      controller: MockController,
      middlewares: [],
    };

    it('should create a CoreResourceRouter with the correct parameters and call it', () => {
      const middlewares: Middleware[] = [jest.fn(), jest.fn()]
      createRouter('v2', middlewares);
      router.resource(config);

      expect(CoreResourceRouter).toHaveBeenCalledWith(config, 'v2', router.middlewares);
      expect(CoreResourceRouter.prototype.call).toHaveBeenCalled();
    });
  });
});