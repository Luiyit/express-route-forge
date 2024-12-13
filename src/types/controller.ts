/* eslint-disable @typescript-eslint/no-explicit-any */
// import CoreController from '@express/router/CoreController';
import { NextFunction, Request, Response } from 'express';
import QueryString from 'qs';
import CoreController from 'src/express/router/CoreController';

export interface CoreHandler {
  name: string | symbol | number;
}

export interface ParamsDictionary {
  [key: string]: string;
}

// Base controller type definition
export type Controller<Child extends CoreController> = Child;

export interface ControllerI<Child extends CoreController> {
  new (
    req: Request<
      ParamsDictionary,
      any,
      any,
      QueryString.ParsedQs,
      Record<string, any>
    >,
    res: Response<any, Record<string, any>>,
    next: NextFunction,
    handler: CoreHandler,
  ): Controller<Child>;
}

export type CoreHandlerName = keyof CoreController;
