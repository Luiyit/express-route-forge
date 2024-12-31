import Joi from 'joi';
import { JoiError } from '../errors';

/**
 * Validate if an object respect the model schema
 *
 * @param data Object to be validated
 * @param schema Joi schema
 * @param options Joi validation options
 *
 * @returns Valid and full InputType object or Errors
 */
function validateJoiSchema<DataType = unknown, ReturnType = DataType>(
  data: DataType,
  schema: Joi.ObjectSchema<ReturnType>,
  options: Joi.ValidationOptions = { abortEarly: false },
): ReturnType {
  if (!schema) return data as unknown as ReturnType;

  const { error, value } = schema.validate(data, options);
  if(!error) return value as ReturnType;
  
  const prettyErrors = error.details
    .map(({ path, message }) => {
      if (!path.length) return false;
      return {
        [path[0] as keyof DataType]: message,
      };
    })
    .filter(Boolean)
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}) as Record<
    keyof DataType,
    string
  >;

  throw new JoiError(error.message, prettyErrors);
}

export default validateJoiSchema;