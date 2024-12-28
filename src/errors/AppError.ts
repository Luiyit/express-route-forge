import { ErrorName, HttpCode } from "src/types/errors";

export default class AppError extends Error {
  constructor(
    message: string,
    public name: ErrorName | string = ErrorName.App,
    public details: Record<string, unknown> = {},
    public code: number = HttpCode.UnprocessableEntity,
  ) {
    super(message);
  }

  public sendToSentry(): void {
    // Send error to Sentry
  }
}
