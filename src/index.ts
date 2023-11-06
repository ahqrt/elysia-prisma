import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { swagger } from "@elysiajs/swagger";

const db = new PrismaClient();

const signDTO = t.Object({
  username: t.String(),
  password: t.String(),
});

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .post("/sign-up", async ({ body }) =>
    db.user.create({
      data: body,
      select: {
        id: true,
        username: true,
      },
    }), {
    error({ code }) {
      switch (code) {
        case "P2002":
          return {
            code: 409,
            error: "Username already exists",
          };
      }
    },
    body: signDTO,
    response: t.Object({
      id: t.Number(),
      username: t.String(),
    }),
  })
  .post("sign-in", async ({ body }) => {
    const user = await db.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!user) {
      return {
        code: 404,
        error: "User not found",
      };
    }

    if (user.password !== body.password) {
      return {
        code: 401,
        error: "Password is incorrect",
      };
    }

    return {
      token: "1234",
    };
  }, {
    body: signDTO,
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
