import { Request, Response, NextFunction } from 'express';
import CoreController from '../CoreController';
import MockRequest from 'src/mocks/express/request';
import MockResponse from 'src/mocks/express/response';
import mockNext from 'src/mocks/express/nextFunction';

import { Method } from 'src/types';
import { resetAll, trackCalls } from 'src/utils/jest';
import CoreResponse from '../CoreResponse';

class MockController extends CoreController {
  async index() {}
  async error() { throw new Error('error'); }
}

let controller: MockController;
let request: Request;
let response: Response;

function init(){
  request = MockRequest.create({ method: Method.GET });
  response = MockResponse.create();
  controller = new MockController(request, response, mockNext, { name: 'index' });

  // @ts-ignore
  trackCalls(controller, ['index', 'knowErrorHandler', 'unknownErrorHandler', 'initialize']);
}

describe('CoreController', () => {
  
  beforeEach(() => {
    init();
  });

  afterEach(() => {
    resetAll();
  });

  it('should initialize class', async () => {
    expect(controller.response instanceof CoreResponse).toBeTruthy();
    expect(controller.req).toBeDefined();
    expect(controller.res).toBeDefined();
    expect(controller.next).toBeDefined();
    expect(controller.handler).toEqual({ name: 'index' });
  });

  describe('call', () => {
    it('should call initialize', async () => {
      await controller.call();
      expect((controller as unknown as { initialize: () => Promise<void> }).initialize).toHaveBeenCalled();
    });
    
    it('should call handler', async () => {
      await controller.call();
      expect(controller.index).toHaveBeenCalled();
    });
    
    it('decorator @ErrorListener should catch not callable method error', async () => {
      controller.handler.name = 'notCallable';
      await controller.call();
      expect(controller.knowErrorHandler).toHaveBeenCalled();
    });
    
    it('decorator @ErrorListener should catch unhandled error', async () => {
      controller.handler.name = 'error';
      await controller.call()

      expect(controller.unknownErrorHandler).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with an error if the controller throws', async () => {
      controller.handler.name = 'error';
      await controller.call();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

})
