import express from 'express';
import { RequestHandlerConstructor, ServeStaticOptions } from 'serve-static';
import mime from 'mime';

const staticMock: jest.Mocked<
  RequestHandlerConstructor<express.Response<any, Record<string, any>>>
> & { mime: typeof mime } = Object.assign(
  jest
    .fn()
    .mockImplementation(
      (
        root: string,
        options?:
          | ServeStaticOptions<express.Response<any, Record<string, any>>>
          | undefined,
      ) => {
        const handler = () => {
          return { root, options };
        };
        return handler;
      },
    ),
  { mime },
);

const middlewares = {
  json: jest.fn(),
  static: staticMock,
}

export default middlewares;
