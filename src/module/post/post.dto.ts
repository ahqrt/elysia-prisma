import { t } from "elysia";

export const postDTO = t.Object({
  title: t.String(),
  content: t.String(),
});
