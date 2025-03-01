import { RequestHandlerParams, RouteParameters } from "src/types/express";
import type { Router } from 'express';
import type {
  RequestHandler,
  RouterOptions,
} from 'express';
import { ParsedQs } from 'qs';


function httpHandler<
  Route extends string,
  P = RouteParameters<Route>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
>(
  path: Route,
  ...handlers: Array<
    | RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    | RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>
  >
): Router {
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  handlers.forEach((handler) => {});
  return {} as unknown as Router;
}

const handlers = ['use', 'get', 'post', 'put', 'delete', 'patch'];

const mocks = handlers.reduce((acc, method) => {
  return {
    ...acc,
    [method]: jest.fn(httpHandler)
  }
}, {});

const expressRouterMock = jest.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (options?: RouterOptions | undefined): Router => {
    return mocks as unknown as Router;
  },
);

export default expressRouterMock;