import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
//! examples   
// hello: publicProcedure
//     .input(z.object({ text: z.string().nullish() }).nullish())
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input?.text ?? "world"}`,
//       };
//     }),
//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.example.findMany();
//   }),
registerUser: publicProcedure
    .input(z.object({username: z.string(), email: z.string().email(), password:z.string()}))
});
