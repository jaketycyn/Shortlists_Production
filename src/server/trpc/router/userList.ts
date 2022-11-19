import { TRPCError } from "@trpc/server";
import { registerSchema } from "../../schema/userSchema";
import { hash } from "argon2";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { addListSchema, deleteListSchema } from "../../schema/listSchema";

export const userListRouter = router({
  addList: protectedProcedure
    .input(addListSchema)
    .mutation(async ({ input, ctx }) => {
      const { listTitle } = input;

      console.log("ctx.session.user: inside userListRouter", ctx.session.user);
      const result = await ctx.prisma.userList.create({
        data: { title: listTitle, userId: ctx.session.user.id },
      });

      return {
        status: 201,
        message: "List created successfully",
        result,
      };
    }),
  getLists: protectedProcedure.query(({ ctx }) => {
    console.log("user.id: ", ctx.session.user.id);

    const results = ctx.prisma.userList.findMany({
      where: { userId: ctx.session.user.id },
    });

    console.log("results: ", results);

    return results;
    // return {
    //   status: 201,
    //   message: "Retrieved user lists successfully",
    //   lists: { results },
    // };
  }),

  deleteList: protectedProcedure
    .input(deleteListSchema)
    .mutation(async ({ ctx, input }) => {
      const { listId, userId } = input;
      // console.log("listId", listId)
      // console.log("userId", userId)
      const results = await ctx.prisma.userList.deleteMany({
        where: { id: listId, userId: userId },
      });

      return {
        status: 201,
        message: "Retrieved user lists successfully",
        results,
      };
    }),
});
