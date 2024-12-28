/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import AppError from "src/errors/AppError";

interface Handler {
  knowErrorHandler(error: AppError): void;
  unknownErrorHandler(error: unknown): Promise<void>;
}

/**
 * Simple wrapper to handle the validation error
 *
 * @param self Caller class
 * @param error Error to be handled
 * 
 * @returns {boolean} True if the error was handled
 */
export function handlerError(self: unknown, error: unknown) {
  if ((typeof (self as Handler).knowErrorHandler === 'function') && error instanceof AppError)
    (self as Handler).knowErrorHandler(error);

  else if ((typeof (self as Handler).unknownErrorHandler === 'function'))
    (self as Handler).unknownErrorHandler(error)
  
  else throw error;
}

/**
 * This decorator catch app errors and delegate the final action to CoreCOntroller
 * To use it, the caller function need to throw an instance of AppError
 *
 * @param target Prototype of class function object
 * @param key Name of the method
 * @param descriptor Properties of the method
 *
 * @returns Descriptor modified
 */
export default function ErrorListener(
  target: Object,
  key: string,
  descriptor: TypedPropertyDescriptor<any>,
) {
  // Original implementation
  const originalMethod = descriptor.value;

  // Overwrite the original implementation to catch the error
  descriptor.value = function (...args: any[]) {
    try {
      const result = originalMethod.apply(this, args);
      const isAsync =
        result &&
        typeof result.then === 'function' &&
        typeof result.catch === 'function';

      /** Handler async error */
      if (isAsync) {
        return result.catch((error: unknown) => {
          handlerError(this, error);
        });
      }

      return result;
    } catch (error) {
      /** Handler async error */
      handlerError(this, error);
    }
  };

  return descriptor;
}
