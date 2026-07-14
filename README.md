> Documentation in progress

# Express router forge

Large utils package to build easily an Express JS application. Flexibility to create routers, include middlewares, handle errors and create the express app.

## Create the app
You can create an App class and extends of ExpressApp.

```ts
// src/App.ts

import express from 'express';
import { AppConfig, ExpressApp } from 'express-route-forge';
import dotenv from 'dotenv';
import { resolve } from 'path';

// For env File | if you need it
dotenv.config();

export default class App extends ExpressApp {
  /**
   * Port to listen the server
   */
  public port: string = process.env.PORT || '8000';

  /**
   * Create Server instance
   *
   * @returns App instance
   */
  static getInstance(): ExpressApp {
    /* Path to load all your controllers | will take a look in a moment */
    const absolutePath = resolve(__dirname, '../controllers');
    const config: AppConfig = {
      autoLoad: {
        paths: [absolutePath],
        exclude: ['tests'],
      },
      cors: true,
      morgan: true,
      bodyParser: true,
    };

    return ExpressApp.initInstance(express(), config);
  }
}
```

Start the server

```ts
// src/index.ts

import App from './App';

const app = App.getInstance();
app.port = process.env.PORT || '8000';

app.start(() => {
  console.info(`Server is Fire at http://localhost:${app.port}`);
});
```

## Create first controller

Les't create a basic class HomeController.

```ts
// src/controllers/HomeController.ts

import {
  CoreController,
  CoreRouter,
  CoreRouterUtil,
  RouteConfig,
} from 'express-route-forge';
import RootRouterUtil from '@app/server/routers/RootRouterUtil';

export default class HomeController extends CoreController {
  async index() {
    this.response.success({
      name: 'Restful API',
    });
  }
}

const config: RouteConfig<HomeController> = {
  handler: 'index',
  method: Method.GET,
  path: '',
  controller: HomeController,
}
const rootRouter = new CoreRouter<HomeController>();
CoreRouterUtil.single(config, rootRouter);
```

## Start the server

Create a dev script command. The script should be something like

```json
{
  "scripts":{
    "dev": "nodemon ./src/index.ts",
  }
}
```

Now just run `yarn dev`

```bash
[nodemon] 3.1.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node -r tsconfig-paths/register ./src/index.ts`
⚓ Router [GET] / added
Server is Fire at http://localhost:8000
```

This is the basic configuration, but you can also create your own CoreRouter to encapsulate router behaviors, register middlewares, and create custom main controllers to manage authorizations and more.

## Authentication

Auth is pluggable and optional. The barrel exports a generic middleware plus
the provider contract; concrete providers live in opt-in adapters so their
dependencies are only needed if you use them.

```ts
import { authenticate, AuthProvider } from 'express-route-forge';

const myProvider: AuthProvider = {
  async authenticate(req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;                    // 401 (unless optional)
    const user = await verifySomehow(token);    // throw => 401 with message
    return { id: user.id, claims: user };
  },
};

// Identity is stored in res.locals.authUser (configurable via localsKey)
router.single({ ..., middlewares: [authenticate(myProvider)] });
```

### Firebase adapter

Requires `firebase-admin` (optional peer, loaded lazily).

```ts
import { authenticateFirebase, firebaseAuthProvider, initWithServiceAccount }
  from 'express-route-forge/adapters/firebase';

// Back-compat with 0.3.x: identity in res.locals.firebaseUser
app.use(authenticateFirebase());
```

### WorkOS adapter

Requires `@workos-inc/node` and `jose` (optional peers, loaded lazily).
Supports AuthKit Bearer access tokens (verified against the WorkOS JWKS) and
sealed session cookies (needs a cookie parser upstream).

```ts
import { authenticateWorkos } from 'express-route-forge/adapters/workos';

app.use(authenticateWorkos({
  apiKey: process.env.WORKOS_API_KEY!,
  clientId: process.env.WORKOS_CLIENT_ID!,
  cookiePassword: process.env.WORKOS_COOKIE_PASSWORD, // for sealed sessions
}));
```

### Migrating from 0.3.x

`authenticateFirebase` moved out of the barrel — one line to migrate:

```diff
- import { authenticateFirebase } from 'express-route-forge';
+ import { authenticateFirebase } from 'express-route-forge/adapters/firebase';
```

`res.locals.firebaseUser` is preserved, but it is now a normalized
`AuthIdentity` (`{ id, claims, raw }`); the decoded Firebase token is at
`firebaseUser.claims`. See CHANGELOG.md for details.

## TODOs
[ ] Finish README.md
[ ] Test coverage for all modules
[ ] Minimum project setup