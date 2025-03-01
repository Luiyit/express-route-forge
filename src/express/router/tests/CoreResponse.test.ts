import "../../../mocks/express";
import MockRequest from "src/mocks/express/request";
import MockResponse from "src/mocks/express/response";
import { Request, Response, NextFunction } from 'express';
import CoreResponse from '../CoreResponse';
import { Method } from "src/types";
import mockNext from "src/mocks/express/nextFunction";

describe('CoreResponse', () => {
  let request: Request;
  let response: Response;
  let coreResponse: CoreResponse;

  beforeEach(() => {
    request = MockRequest.create({ method: Method.GET });
    response = MockResponse.create();
    coreResponse = new CoreResponse(response, request, mockNext);
  });
  
  describe('error', () => {
    it('should send an error response with default code 422', () => {
      const message = 'Test error message';
      const name = 'TestError';

      coreResponse.error(message, undefined, name);

      expect(response.status).toHaveBeenCalledWith(422);
      expect(response.send).toHaveBeenCalledWith({
        success: false,
        error: message,
        details: {
          source: name,
        },
      });
    });

    it('should send an error response with provided code', () => {
      const message = 'Test error message';
      const code = 400;
      const name = 'TestError';

      coreResponse.error(message, code, name);

      expect(response.status).toHaveBeenCalledWith(code);
      expect(response.send).toHaveBeenCalledWith({
        success: false,
        error: message,
        details: {
          source: name,
        },
      });
    });

    it('should send an error response with extra details', () => {
      const message = 'Test error message';
      const code = 500;
      const name = 'TestError';
      const extra = { info: 'Additional info' };

      coreResponse.error(message, code, name, extra);

      expect(response.status).toHaveBeenCalledWith(code);
      expect(response.send).toHaveBeenCalledWith({
        success: false,
        error: message,
        details: {
          source: name,
          info: 'Additional info',
        },
      });
    });

  });
  
  describe('success', () => {
    it('should send a success response with provided data', () => {
      const data = { key: 'value' };
      coreResponse.success(data);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it('should send a success response with no data', () => {
      coreResponse.success(undefined);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith({
        success: true,
        data: undefined,
      });
    });
  });
});