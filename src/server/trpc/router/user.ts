import { TRPCError } from "@trpc/server";
import { registerSchema } from "../../schema/userSchema";
import { hash } from "argon2";

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

        const userExists = await ctx.prisma.user.findFirst({
            where: {email}
        });

        if (userExists) {
            throw new TRPCError({
                code: "CONFLICT", 
                message: "User already exists.",
            })
        }

        const hashedPassword = await hash(password)

        const result = await ctx.prisma.user.create({
            data: {username, email, password: hashedPassword},
        })

        return {
            status: 201,
            message: "Account created successfully",
            result: result.email,
        }
        
        
    })
});