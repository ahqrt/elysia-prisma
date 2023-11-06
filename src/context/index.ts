import Elysia from "elysia";
import { db } from "../db";
import { isSigned } from "../decorate/auth.decorate";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";

const ctx = new Elysia({ name: "ctx" })
  .state("db", db)
  .use(jwt({
    name: "jwt",
    secret: "hello, this is a jwt token",
    exp: "1d",
  }))
  .use(bearer());

export default ctx;
