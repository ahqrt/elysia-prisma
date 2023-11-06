import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

import { userController } from "./module/user/controller";
import postController from "./module/post/controller";

const app = new Elysia()
  .use(swagger({
    path: "/docs",
    documentation: {
      info: {
        title: "Elysia API",
        description: "Elysia API Documentation",
        version: "1.0.0",
      },
    },

    swaggerOptions: {
      persistAuthorization: true,
    },
  }))
  .use(userController)
  .use(postController)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export default app;
