import Elysia from "elysia";
import ctx from "../../context";
import { isSigned } from "../../decorate/auth.decorate";

const postController = new Elysia({ name: "post", prefix: "/post" })
  .use(ctx)
  .post("/create-post", async ({ body }) => {
    return "hello world";
  }, {
    beforeHandle(context) {
      return isSigned(context);
    },
  });

export default postController;
