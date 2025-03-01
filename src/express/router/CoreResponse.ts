import { NextFunction, Request, Response } from 'express';

Response

export default class CoreResponse {
  constructor(
    public res: Response,
    public req: Request,
    public next: NextFunction,
  ) {}

  error(
    message: string,
    code: number = 422,
    name: string,
    extra?: Record<string, unknown>,
  ): void {
    /**
     * DEV NOTE:
     * Avoid double send of the headers
     * 
     * TODO!
     * if (this.req.timedout) return;
     */
    
    this.res.status(code).send({
      success: false,
      error: message,
      details: {
        source: name,
        ...extra,
      },
    });
  }

  success(data: unknown): void {
    this.res.status(200).send({
      success: true,
      data,
    });
  }
}
