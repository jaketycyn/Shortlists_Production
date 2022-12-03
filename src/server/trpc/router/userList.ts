import { router, protectedProcedure } from "../trpc";
import {
  addListSchema,
  archiveListSchema,
  deleteListSchema,
  shareListSchema,
  updateListSchema,
} from "../../schema/listSchema";
import { title } from "process";

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
  shareList: protectedProcedure
    .input(shareListSchema)
    //can add back in CTX later but removed because of the scenario where someone can share someone else's list thus their ID wouldnt' be taken from here but rather passed along from the shareform page.
    .mutation(async ({ input, ctx }) => {
      //! NEED ITEM VALUES
      //? Do I pass items with a parentItemId to attach everyitem to another item at one point?
      const { userId, listTitle, listId, targetEmail } = input;

      //!Hardcoded itemTitle
      const itemTitle = "Chicken";
      const itemTitle2 = "Broccoli";
      const items = [itemTitle, itemTitle2];
      const dataArray = Array.from([items]).map(() => {
        title: items;
      });
      // console.log("SHARELIST - inputs: ", input);

      // use targetEmail and search DB and retrieve userID corresponding to targetEmail

      //! Will want a way to prevent password from coming back for security reasons in the future
      const FoundUser = await ctx.prisma.user.findFirst({
        where: { email: targetEmail },
      });

      if (FoundUser) {
        console.log("FoundUser: ", FoundUser);
        console.log("ID: ", FoundUser?.id);
        // with userId corresponding to targetEmail create a new list referencing the old listID, for the targetEmail user with its own unique ID
        //! will need to attach parentList value and add said value to scheme
        const newList = await ctx.prisma.userList.create({
          data: { title: listTitle, userId: FoundUser!.id },
        });

        console.log("newList: ", newList);
        console.log("newList ID: ", newList.id);

        // create items inside list in the new List with reference to the original 'parent' id

        //depending on iTems array fire function
        if (items.length === 0) {
          console.log("no items Found");
        }
        if (items.length === 1) {
          //! create 1 item
          const newItem = await ctx.prisma.userItem.create({
            data: {
              title: itemTitle,
              listId: newList.id,
              userId: FoundUser!.id,
            },
          });
          return {
            status: 201,
            message: "List shared successfully",
            newList,
            newItem,
          };
        }
        if (items.length > 1) {
          //! create many test
          const newItems = await ctx.prisma.userItem.createMany({
            data: [
              { title: itemTitle, listId: newList.id, userId: FoundUser!.id },
              { title: itemTitle2, listId: newList.id, userId: FoundUser!.id },
            ],
            skipDuplicates: true,
          });
          return {
            status: 201,
            message: "List shared successfully",
            newList,
            newItems,
          };
        }
      }
    }),
});
