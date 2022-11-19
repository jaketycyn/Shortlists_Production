import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { exampleRouter } from "./example";
import { userListRouter } from "./userList";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  user: userRouter,
  userList: userListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
