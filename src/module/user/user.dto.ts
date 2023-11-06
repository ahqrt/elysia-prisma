import { t } from "elysia";

export const signDTO = t.Object({
  username: t.String(),
  password: t.String(),
});
