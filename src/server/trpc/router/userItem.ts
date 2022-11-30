import { router, protectedProcedure } from "../trpc";
import {
  addItemSchema,
  deleteItemSchema,
  updateItemSchema,
} from "../../schema/itemSchema";
import { z } from "zod";

//! change userList to userItem
//! change List and list to Item or item respectively

export const userItemRouter = router({
  addItem: protectedProcedure
    .input(addItemSchema)
    .mutation(async ({ input, ctx }) => {
      const { itemTitle, listId } = input;

      const result = await ctx.prisma.userItem.create({
        data: { title: itemTitle, listId: listId, userId: ctx.session.user.id },
      });

      return {
        status: 201,
        message: "Item created successfully",
        result,
      };
    }),

  getItems: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ input, ctx }) => {
      //console.log("user.id: ", ctx.session.user.id);
      const { listId } = input;
      const results = ctx.prisma.userItem.findMany({
        where: { userId: ctx.session.user.id, listId: listId },
      });

      console.log("results: ", results);

      return results;
      // return {
      //   status: 201,
      //   message: "Retrieved user lists successfully",
      //   items: { results },
      // };
    }),

  //   deleteList: protectedProcedure
  //     .input(deleteListSchema)
  //     .mutation(async ({ ctx, input }) => {
  //       const { listId, userId } = input;
  //       // console.log("listId", listId)
  //       // console.log("userId", userId)
  //       await ctx.prisma.userList.deleteMany({
  //         where: { id: listId, userId: userId },
  //       });

  //       return {
  //         //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
  //         // "The successful result of a PUT or a DELETE is often not a 200 OK but a 204 No Content (or a 201 Created when the resource is uploaded for the first time)."
  //         //https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
  //         status: 204,
  //         message: "Delete user list successfully",
  //       };
  //     }),
  //   changeListTitle: protectedProcedure
  //     .input(updateListSchema)
  //     .mutation(async ({ ctx, input }) => {
  //       const { listId, title, userId } = input;
  //       // console.log("listId", listId)
  //       // console.log("userId", userId)

  //       await ctx.prisma.userList.updateMany({
  //         where: { id: listId, userId: userId },
  //         data: {
  //           title: title,
  //         },
  //       });

  //       return {
  //         //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
  //         // "The successful result of a PUT or a DELETE is often not a 200 OK but a 204 No Content (or a 201 Created when the resource is uploaded for the first time)."
  //         //https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
  //         status: 204,
  //         message: "Change user list title successful",
  //       };
  //    }),
});
