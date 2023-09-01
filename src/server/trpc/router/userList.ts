import { router, protectedProcedure } from "../trpc";
import {
  addListSchema,
  archiveListSchema,
  deleteListSchema,
  shareListSchema,
  updateListSchema,
  getListsByUserIdSchema,
} from "../../schema/listSchema";
import { title } from "process";
import { getLists } from "../../../slices/listSlice";

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

  archiveList: protectedProcedure
    .input(archiveListSchema)
    .mutation(async ({ ctx, input }) => {
      const { listId, userId, archive } = input;
      // console.log("listId", listId)
      // console.log("userId", userId)
      await ctx.prisma.userList.updateMany({
        where: { id: listId, userId: userId },
        data: {
          archive: archive,
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
  getListsByUserId: protectedProcedure
    .input(getListsByUserIdSchema)
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      const results = await ctx.prisma.userList.findMany({
        where: { userId },
      });

      return results;
    }),

  shareList: protectedProcedure
    .input(shareListSchema)
    //can add back in CTX later but removed because of the scenario where someone can share someone else's list thus their ID wouldnt' be taken from here but rather passed along from the shareform page.
    .mutation(async ({ input, ctx }) => {
      //! NEED ITEM VALUES
      //? Do I pass items with a parentItemId to attach everyitem to another item at one point?
      const { userId, parentListUserId, listTitle, listId, items, category } =
        input;
      console.log("items: ", items);
      //!Hardcoded itemTitle

      const sentItems = items as any;
      // const dataArray = Array.from([items]).map(() => {
      //   title: items;
      // });
      // console.log("SHARELIST - inputs: ", input);

      // use targetEmail and search DB and retrieve userID corresponding to targetEmail

      //! will create list before checking for item errors - kinda an issue

      //! Will want a way to prevent password from coming back for security reasons in the future
      const FoundUser = await ctx.prisma.user.findFirst({
        where: { id: userId },
      });

      if (FoundUser) {
        console.log("FoundUser: ", FoundUser);
        console.log("ID: ", FoundUser?.id);
        console.log("items: ", items);
        console.log("category: ", category);
        // with userId corresponding to targetEmail create a new list referencing the old listID, for the targetEmail user with its own unique ID

        const newList = await ctx.prisma.userList.create({
          data: {
            title: listTitle,
            userId: FoundUser!.id,
            parentListId: listId,
            parentListUserId: parentListUserId,
            category: category,

            // parentListId: listId,
          },
        });

        console.log("newList: ", newList);
        console.log("newList ID: ", newList.id);

        // create items inside list in the new List with reference to the original 'parent' id
        // will eventually need to attach parentList value and add said value to scheme for prompts, but those can be in their own call
        //depending on iTems array fire function

        if (sentItems.length === 0) {
          console.log("no items Found");
          return {
            status: 201,
            message: "List shared successfully",
            newList,
          };
        } else if (sentItems.length === 1) {
          console.log("create 1 item");
          //! create 1 item
          const newItem = await ctx.prisma.userItem.create({
            data: {
              title: items[0]!.title,
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
        } else if (sentItems.length > 1) {
          console.log(`create ${items.length}  items`);
          //! create many test

          console.log("sent items: ", sentItems);
          console.log("sent items: ", sentItems);
          console.log("sent items: ", sentItems);
          //map out only title from original items
          const sentItemsTitleArray = sentItems.map(
            (i: any) =>
              new Object({
                title: i.title,
                userId: "",
                listId: "",
              })
          );
          console.log("sentItemsTitle: ");

          //add props to new array - listId: newList.id & userId: FoundUser!.id
          console.log("newList.id: ", newList.id);
          console.log(" FoundUser!.id: ", FoundUser!.id);

          const newListId = newList.id;
          //
          sentItemsTitleArray.forEach((i: any) => {
            (i.listId = newListId), (i.userId = FoundUser!.id);
          });
          console.log("newItemsObjectArray: ");

          const newItems = await ctx.prisma.userItem.createMany({
            data: sentItemsTitleArray,
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
