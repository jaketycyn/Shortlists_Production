import { TRPCError } from "@trpc/server";
import { registerSchema } from "../../schema/userSchema";
import { hash } from "argon2";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const friendshipRouter = router({
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

  //findFriendships,
  getFriendships: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.prisma.friendship.findMany({
      where: {
        OR: [
          {
            senderId: ctx.session.user.id,
          },
          {
            receiverId: ctx.session.user.id,
          },
        ],
      },
    });

    return {
      status: 201,
      message: "Retrieved Friendships",
      results,
    };
  }),

  sendFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      console.log("inside sendFriendRequest");
      console.log("receiverId: ", input);
      //console.log("ctx.session.user.id: ", ctx.session.user.id);

      //check if friendship already exists if not then create new friendship. If friendship already exists send back console message and later we'll create something from it. For now it should never display the ability to send a friend request to a user when firing this function.

      //   const findFriendship = await ctx.prisma.friendship.findFirst({
      //     where: { senderId: input, receiverId: ctx.session.user.id},
      //   });

      const friendRequest = await ctx.prisma.friendship.create({
        data: {
          senderId: ctx.session.user.id,
          receiverId: input,
          status: "pending",
        },
      });
      //   create({
      //     data: { senderId: input, receiverId: ctx.session.user.id },
      //   });

      return {
        status: 201,
        message: "Friend Request Pending",
        results: friendRequest,
      };
    }),
  //   findUser: protectedProcedure
  //     .input(z.object({ email: z.string().email() }))
  //     .mutation(async ({ input, ctx }) => {
  //       const { email } = input;
  //       const userMatch = await ctx.prisma.user.findUnique({
  //         where: { email },
  //       });
  //       return {
  //         status: 201,
  //         message: "User Matches successfully",
  //         result: {
  //           user: userMatch,
  //         },
  //       };
  //     }),
});
