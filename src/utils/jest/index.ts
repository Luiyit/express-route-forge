export function resetAll(){
  jest.clearAllMocks();
  jest.restoreAllMocks();
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function trackCalls<ObjectType extends {}, Key extends keyof ObjectType>(
  object: ObjectType,
  methods: Key[] | Key,
) {
  if(Array.isArray(methods)){
    methods.forEach((method: Key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(object, method as any);
    });
  } else { jest.spyOn(object, methods as any); }
}

const jestUtil = {
  resetAll,
  trackCalls,
}

export default jestUtil;
