const handlers = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'listen', 'use', 'set'];

const app = handlers.reduce((acc, method) => {
  return {
    ...acc,
    [method]: jest.fn()
  }
}, {});

export default app;