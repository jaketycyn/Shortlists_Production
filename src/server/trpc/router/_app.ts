import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { userRouter } from "./user";
import { userItemRouter } from "./userItem";
import { userListRouter } from "./userList";

export const appRouter = router({
  auth: authRouter,
  example: exampleRouter,
  user: userRouter,
  userItem: userItemRouter,
  userList: userListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
