import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';

type Bindings = {
  JWT_SECRET: string;
};

export const authMiddleware = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256',
  });
  return jwtMiddleware(c, next);
});
