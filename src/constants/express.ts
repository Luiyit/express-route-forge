import { Callback, Method } from "../types/route";

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
