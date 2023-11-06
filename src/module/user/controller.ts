import Elysia, { Context, t } from "elysia";
import { signDTO } from "./user.dto";
import ctx from "../../context";

export const userController = new Elysia({ prefix: "/user", name: "user" })
  .use(ctx)
  .post("/sign-up", async ({ body, store: { db } }) =>
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
  .post("/sign-in", async ({ body, jwt, store: { db } }) => {
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
  });
