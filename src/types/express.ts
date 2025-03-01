/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Errback,
  ErrorRequestHandler,
  RequestHandler,
} from 'express';
import { ParsedQs } from 'qs';

type RemoveTail<
  S extends string,
  Tail extends string,
> = S extends `${infer P}${Tail}` ? P : S;

export interface ParamsDictionary {
  [key: string]: string;
}
type GetRouteParameter<S extends string> = RemoveTail<
  RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
  `.${string}`
>;

export type RouteParameters<Route extends string> = string extends Route
  ? ParamsDictionary
  : Route extends `${string}(${string}`
  ? ParamsDictionary // TODO: handling for regex parameters
  : Route extends `${string}:${infer Rest}`
  ? (GetRouteParameter<Rest> extends never
      ? ParamsDictionary
      : GetRouteParameter<Rest> extends `${infer ParamName}?`
      ? { [P in ParamName]?: string }
      : { [P in GetRouteParameter<Rest>]: string }) &
      (Rest extends `${GetRouteParameter<Rest>}${infer Next}`
        ? RouteParameters<Next>
        : unknown)
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {};

export type RequestHandlerParams<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
> =
  | RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
  | ErrorRequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
  | Array<RequestHandler<P> | ErrorRequestHandler<P>>;

  export interface IExpressResponse {
    json(payload: Record<string, unknown>): this;
    status(code: number): this;
    send(data: Record<string, unknown>): this;
    setHeader(key: string, value: number | string | readonly string[]): this;
    download(path: string, filename: string, fn?: Errback): void;
  }