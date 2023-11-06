import Elysia from "elysia";
import ctx from "../../context";
import { hasPermission, isSigned } from "../../decorate/auth.decorate";
import { postDTO } from "./post.dto";
import { JwtInfo } from "../../types/jwtInfo";

const postController = new Elysia({ name: "post", prefix: "/post" })
  .use(ctx)
  .post("/create-post", async ({ bearer, body, jwt, store: { db } }) => {
    const info = await jwt.verify(bearer) as unknown as JwtInfo;
    const uid = info.id;

    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(uid),
      },
    });
    return post;
  }, {
    body: postDTO,
    beforeHandle(context) {
      return isSigned(context);
    },
  });

export default postController;
