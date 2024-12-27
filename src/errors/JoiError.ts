import { ErrorName } from "src/types/errors";
import AppError from "./AppError";

export default class JoiError<DataType = unknown> extends AppError {
  constructor(message: string, details: Record<keyof DataType, string>) {
    super(message, ErrorName.Joi, details);
  }
}
