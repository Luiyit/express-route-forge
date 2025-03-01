import "../../../mocks/express";
import CoreRouter from '../CoreExpressRouter';
import { Method, MethodList, RouteConfig } from '../../../types/route';
import CoreController from '../CoreController';
import { trackCalls } from "src/utils/jest";
import MockRequest from "src/mocks/express/request";
import MockResponse from "src/mocks/express/response";
import mockNext from "src/mocks/express/nextFunction";
import { Request, Response, NextFunction } from 'express';

class MockController extends CoreController {
  async index() {}
  async error() { throw new Error("error"); }
}

let config: RouteConfig<MockController>;
function init(method: Method = Method.GET) {
  config  = {
    controller: MockController,
    handler: 'index',
    method,
    path: '/mock',
    middlewares: [],
  };

  trackCalls(CoreRouter, ['createHandler']);
}

describe('CoreRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPath', () => {
    it('should join paths correctly', () => {
      expect(CoreRouter.getPath('api', 'v1', 'users')).toBe('/api/v1/users');
      expect(CoreRouter.getPath('/api', 'v1', 'users')).toBe('/api/v1/users');
      expect(CoreRouter.getPath('api', '', 'users')).toBe('/api/users');
    });
  });

  describe('add', () => {
    MethodList.forEach((method) => {
      it(`should add a ${method} route`, () => {
        init(method);
        CoreRouter.add(config);

        const { expressRouter } = CoreRouter;
        const methodFn = method.toLowerCase() as keyof typeof expressRouter;
        expect(expressRouter[methodFn]).toHaveBeenCalledWith(
          '/mock',
          expect.any(Function)
        );
        expect(CoreRouter.createHandler).toHaveBeenCalledWith(MockController, { name: config.handler });
      });
    });
    
    it('should throw an error for empty method', () => {
      init('' as Method);
      expect(() => CoreRouter.add(config)).toThrow('Method is not valid');
    });

    it('should throw an error for an invalid method', () => {
      init('INVALID' as Method);
      expect(() => CoreRouter.add(config)).toThrow('Method "INVALID" is not valid');
    });
  });

  describe('createHandler', () => {

    let request: Request;
    let response: Response;

    beforeEach(() => {
      trackCalls(MockController.prototype, ['call', 'index']);
      
      request = MockRequest.create({ method: Method.GET });
      response = MockResponse.create();
    });

    it('should create a handler that calls the controller', async () => {
      
      const handler = CoreRouter.createHandler(MockController, { name: 'index' });
      await handler(request, response, mockNext);

      expect(MockController.prototype.call).toHaveBeenCalled()
      expect(MockController.prototype.index).toHaveBeenCalled()
      expect(mockNext).not.toHaveBeenCalled()
    });
  });
});