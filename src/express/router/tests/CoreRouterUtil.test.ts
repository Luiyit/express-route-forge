import CoreRouterUtil from '../CoreRouterUtil';
import CoreController from '../CoreController';
import CoreRouter from '../CoreRouter';
import { RouteConfig, ResourceConfig, Method } from '../../../types/route';

class MockController extends CoreController {
  async index(){}
}
class MockRouter extends CoreRouter<MockController> {
  single = jest.fn();
  resource = jest.fn();
}

describe('CoreRouterUtil', () => {
  let mockRouter: MockRouter;
  let routeConfig: RouteConfig<MockController>;
  let resourceConfig: ResourceConfig<MockController>;

  beforeEach(() => {
    mockRouter = new MockRouter();
    routeConfig = { 
      controller: MockController, 
      path: '/test', 
      handler: 'index', 
      method: Method.GET,
    };

    resourceConfig = { 
      name: 'mock', 
      path: '/test', 
      controller: MockController, 
    };
  });
  
  describe('single', () => {
    it('should call router.single with the correct config', () => {
      CoreRouterUtil.single(routeConfig, mockRouter);
      expect(mockRouter.single).toHaveBeenCalledWith(routeConfig);
    });
  });

  describe('resource', () => {
    it('should call router.resource with the correct config', () => {
      CoreRouterUtil.resource(resourceConfig, mockRouter);
      expect(mockRouter.resource).toHaveBeenCalledWith(resourceConfig);
    });
  });
});