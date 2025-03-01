import { callbackList, callbackMethods } from '../express';
import { Method } from '../../types/route';

describe('Express Constants', () => {
  it('should contain all methods', () => {
    expect(callbackList).toEqual([
      'index',
      'show',
      'create',
      'update',
      'destroy',
      'patch',
    ]);
  });

  it('should have all callback methods', () => {
    expect(callbackMethods.index).toBe(Method.GET);
    expect(callbackMethods.show).toBe(Method.GET);
    expect(callbackMethods.create).toBe(Method.POST);
    expect(callbackMethods.update).toBe(Method.PUT);
    expect(callbackMethods.patch).toBe(Method.PATCH);
    expect(callbackMethods.destroy).toBe(Method.DELETE);
  });
});