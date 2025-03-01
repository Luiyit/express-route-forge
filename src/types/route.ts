import { RequestHandler } from 'express';
import { ParsedQs } from "qs";
import CoreController from '../express/router/CoreController';
import { ControllerI, ParamsDictionary } from './controller';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export const MethodList: Method[] = Object.values(Method) as Method[];

export enum MethodNames {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type Callback =
  | 'index'
  | 'show'
  | 'create'
  | 'update'
  | 'destroy'
  | 'patch';

export interface RouteConfig<Child extends CoreController> {
  handler: keyof Child;
  path: string;
  method: Method;
  controller: ControllerI<Child>;
  middlewares?: Middleware[];
}

export interface ResourceConfig<Child extends CoreController> {
  name: string;
  path?: string;
  only?: Callback[];
  exclude?: Callback[];
  controller: ControllerI<Child>;
  middlewares?: Middleware[];
}

export type RouteParameters = ParamsDictionary;
export type Middleware<
  P = RouteParameters,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
> = RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>

export type RouterArgs<
  Route extends string = string,
  P = RouteParameters,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
> = [
  path: Route,
  ...handlers: Array<Middleware<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
];