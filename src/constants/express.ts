// import { Callback, Method } from '@libTypes/route';
import { Callback, Method } from "src/types/route";

export const callbackList: Callback[] = [
  'index',
  'show',
  'create',
  'update',
  'destroy',
  'patch',
];

export const callbackMethods: Record<Callback, Method> = {
  index: Method.GET,
  show: Method.GET,
  create: Method.POST,
  update: Method.PUT,
  destroy: Method.DELETE,
  patch: Method.PATCH,
};
