// import { ErrorName } from '@libTypes/errors';

import { ErrorName } from "src/types/errors";

export default class AppError extends Error {
  constructor(
    message: string,
    public name: ErrorName = ErrorName.App,
    public details: Record<string, string> = {},
    public code: number = 422,
  ) {
    super(message);
  }

  public sendToSentry(): void {
    // Send error to Sentry
  }
}
