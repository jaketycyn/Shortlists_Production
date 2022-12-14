import { router, protectedProcedure } from "../trpc";
import {
  addItemSchema,
  archiveItemSchema,
  archiveItemsSchema,
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

  archiveItem: protectedProcedure
    .input(archiveItemSchema)
    .mutation(async ({ ctx, input }) => {
      const { itemId, listId, userId, archiveStatus } = input;
      // console.log("listId", listId)
      // console.log("userId", userId)
      //TODO: later change archive "trash" to a seperate deleted status + deletedDate status for proper date of deleted items - allows recycle bin to have most recently deleted items at the top via a dateFilter.
      await ctx.prisma.userItem.updateMany({
        where: { id: itemId, listId: listId, userId: userId },
        data: {
          archive: archiveStatus,
        },
      });

      return {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
        // "The successful result of a PUT or a DELETE is often not a 200 OK but a 204 No Content (or a 201 Created when the resource is uploaded for the first time)."
        //https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
        status: 204,
        message: "Archived user item successfully",
      };
    }),
  archiveManyItems: protectedProcedure
    .input(archiveItemsSchema)
    .mutation(async ({ ctx, input }) => {
      const { listId, userId, archiveStatus } = input;
      // console.log("listId", listId)
      // console.log("userId", userId)
      await ctx.prisma.userItem.updateMany({
        where: { listId: listId, userId: userId },
        data: {
          archive: archiveStatus,
        },
      });

      return {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
        // "The successful result of a PUT or a DELETE is often not a 200 OK but a 204 No Content (or a 201 Created when the resource is uploaded for the first time)."
        //https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
        status: 204,
        message: "Archived user items successfully",
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

      //way to convert results .createdAT property from Date to string() - It's created as DateTime but when brought in via prisma it converts to Date object.

      console.log("results within GETITEMS: ", results);

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
