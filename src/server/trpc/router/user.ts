import { TRPCError } from "@trpc/server";
import { registerSchema } from "../../schema/userSchema";
import { hash } from "argon2";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  findUser: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const { email } = input;
      const userMatch = await ctx.prisma.user.findUnique({
        where: { email },
      });
      return {
        status: 201,
        message: "User Matches successfully",
        result: {
          user: userMatch,
        },
      };
    }),
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.prisma.user.findMany({
      select: {
        email: true,
        name: true,
        id: true,
      },
    });

    return {
      status: 201,
      message: "Retrieved All Users",
      results,
    };
  }),
  registerUser: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

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
        data: { name, email, password: hashedPassword },
      });

      console.log("result: ", result);

      return {
        status: 201,
        message: "Account created successfully",
        result: {
          email: result.email,
          id: result.id,
          name: result.name,
        },
      };
    }),
});
