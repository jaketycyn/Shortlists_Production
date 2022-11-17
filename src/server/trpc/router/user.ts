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
    .input(registerSchema)
    .mutation(async ({input, ctx}) => {
        const {username, email, password} = input;

        const exists = await ctx.prisma.user.findFirst({})
        where: {email}
        
    })
});
