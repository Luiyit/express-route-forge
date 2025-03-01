import app from './app';
import router from './router';
import middlewares from './middlewares';

// Mock express module
const expressMock = jest.mock('express', () => ({
    __esModule: true,
    default: () => app,
    Router: router,
    json: middlewares.json,
    static: middlewares.static,
}));

export default expressMock;