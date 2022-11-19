import { TRPCError } from "@trpc/server";
import { registerSchema } from "../../schema/userSchema";
import { hash } from "argon2";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { addListSchema } from "../../schema/listSchema";

export const userListRouter = router({
  addList: protectedProcedure
    .input(addListSchema)
    .mutation(async ({ input, ctx }) => {
      const { listTitle } = input;

      console.log("ctx.session.user: inside userListRouter", ctx.session.user);
    }),

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
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input;

      const userExists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (userExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
});
