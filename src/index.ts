import { Context, Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";

const db = new PrismaClient();

const signDTO = t.Object({
  username: t.String(),
  password: t.String(),
});

const postDTO = t.Object({
  title: t.String(),
  content: t.String(),
});

async function isSigned({ bearer, jwt, set }: any) {
  console.log("isSigned", bearer);
  if (!bearer) {
    set.status = 401;
    return "Unauthorized";
  }

  const profile = await jwt.verify(bearer);

  if (!profile) {
    set.status = 401;
    return "token not valid";
  }
}

const app = new Elysia()
  .decorate("isSigned", isSigned)
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
  .use(jwt({
    name: "jwt",
    secret: "hello, this is a jwt token",
    exp: "1d",
  }))
  .use(bearer())
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
        // @ts-ignore
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
  .post("sign-in", async ({ body, jwt }) => {
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

    const token = await jwt.sign({
      id: user.id.toString(),
      username: user.username,
    });

    return {
      username: user.username,
      token,
    };
  }, {
    body: signDTO,
  })
  .post("create-post", async ({ body }) => {
    return "hello world";
  }, {
    beforeHandle: [isSigned],
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
