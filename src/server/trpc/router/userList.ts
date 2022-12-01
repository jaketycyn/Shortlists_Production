import { router, protectedProcedure } from "../trpc";
import {
  addListSchema,
  archiveListSchema,
  deleteListSchema,
  updateListSchema,
} from "../../schema/listSchema";

export const userListRouter = router({
  addList: protectedProcedure
    .input(addListSchema)
    .mutation(async ({ input, ctx }) => {
      const { listTitle } = input;

      //console.log("ctx.session.user: inside userListRouter", ctx.session.user);

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
    //console.log("user.id: ", ctx.session.user.id);

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
  archiveList: protectedProcedure
    .input(archiveListSchema)
    .mutation(async ({ ctx, input }) => {
      const { listId, userId, archiveStatus } = input;
      // console.log("listId", listId)
      // console.log("userId", userId)
      await ctx.prisma.userList.updateMany({
        where: { id: listId, userId: userId },
        data: {
          archive: archiveStatus,
        },
      });

      return {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
        // "The successful result of a PUT or a DELETE is often not a 200 OK but a 204 No Content (or a 201 Created when the resource is uploaded for the first time)."
        //https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
        status: 204,
        message: "Archived user list successfully",
      };
    }),
  deleteList: protectedProcedure
    .input(deleteListSchema)
    .mutation(async ({ ctx, input }) => {
      const { listId, userId } = input;
      // console.log("listId", listId)
      // console.log("userId", userId)
      //!in current iteration will not work as long as items with association to this list exist and are connected
      await ctx.prisma.userList.deleteMany({
        where: { id: listId, userId: userId },
      });

      return {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
        // "The successful result of a PUT or a DELETE is often not a 200 OK but a 204 No Content (or a 201 Created when the resource is uploaded for the first time)."
        //https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
        status: 204,
        message: "Delete user list successfully",
      };
    }),
  changeListTitle: protectedProcedure
    .input(updateListSchema)
    .mutation(async ({ ctx, input }) => {
      const { listId, title, userId } = input;
      // console.log("listId", listId)
      // console.log("userId", userId)

      await ctx.prisma.userList.updateMany({
        where: { id: listId, userId: userId },
        data: {
          title: title,
        },
      });

      return {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
        // "The successful result of a PUT or a DELETE is often not a 200 OK but a 204 No Content (or a 201 Created when the resource is uploaded for the first time)."
        //https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
        status: 204,
        message: "Change user list title successful",
      };
    }),
});
