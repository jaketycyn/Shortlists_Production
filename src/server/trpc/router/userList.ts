import { router, protectedProcedure } from "../trpc";
import {
  addListSchema,
  archiveListSchema,
  deleteListSchema,
  shareListSchema,
  updateListSchema,
  getListsByUserIdSchema,
  copyListSchema,
} from "../../schema/listSchema";
import { title } from "process";
import { getLists } from "../../../slices/listSlice";

export const userListRouter = router({
  addList: protectedProcedure
    .input(addListSchema)
    .mutation(async ({ input, ctx }) => {
      const { listTitle, category } = input;

      //console.log("ctx.session.user: inside userListRouter", ctx.session.user);

      const result = await ctx.prisma.userList.create({
        data: {
          title: listTitle,
          userId: ctx.session.user.id,
          category,
        },
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
  copyList: protectedProcedure
    //! NEED TO CHANGE THE SYSTEM FROM CREATING A NEW LIST WITH A NEW LIST ID AND ASSOCIATING THAT LISTID w/ THE NEW ITEMS TO CREATING NEW ITEMS THAT ARE COPIES OF THE ORIGINAL ITEMS AND ASSOCIATING THEM WITH THE ORIGINAL LISTID AND THE NEW USERID
    .input(copyListSchema)
    //can add back in CTX later but removed because of the scenario where someone can share someone else's list thus their ID wouldnt' be taken from here but rather passed along from the shareform page.
    .mutation(async ({ input, ctx }) => {
      try {
        const { userId, parentListUserId, listTitle, listId, items, category } =
          input;
        console.log("items: ", items);
        console.log("input: ", input);
        console.log("hi inside here");
        const sentItems = items as any;
        // console.log("listId: ", listId);
        // // use targetEmail and search DB and retrieve userID corresponding to targetEmail
        // //! will create list before checking for item errors - kinda an issue
        // //! Will want a way to prevent password from coming back for security reasons in the future
        const FoundUser = await ctx.prisma.user.findFirst({
          where: { id: userId },
        });

        console.log("FoundUser: ", FoundUser);

        if (!FoundUser) throw new Error("User not found");

        // create new items for user
        if (FoundUser) {
          //create new list for user
          const newList = await ctx.prisma.userList.create({
            data: {
              title: listTitle,
              userId: FoundUser!.id,
              category,
              parentListId: listId,
              parentListUserId,
            },
          });

          //? Later will need to create a check that if an error happens when creating the items either the list is deleted or a new pending action occurs for the items which weren't created.

          const newListId = newList.id;
          console.log("newListId: ", newListId);

          if (sentItems.length === 0) {
            console.log("no items Found");
            return {
              status: 201,
              message: "List shared successfully",
            };
          } else if (sentItems.length === 1) {
            // create 1 item
            // console.log("create 1 item");
            const newItem = await ctx.prisma.userItem.create({
              data: {
                title: items[0]!.title,
                listId: newListId,
                userId: FoundUser!.id,
                parentListId: listId,
              },
            });
            return {
              status: 201,
              message: "List shared successfully",
              newItem,
            };
          } else if (sentItems.length > 1) {
            try {
              console.log(`create ${items.length}  items`);
              //     //map out only title from original items
              const sentItemsTitleArray = sentItems.map((i: any) => {
                return {
                  title: i.title,
                  userId: FoundUser!.id, // Ensure this is a string, not a number
                  listId: newListId, // Ensure this is a string, not a number
                  parentUserId: parentListUserId, // If this is not provided, it will default to "undefined" (string)
                  parentListId: listId, // Can be omitted if not available (will default to null)
                  // We'll omit `id` and `createdAt` since they have default values.
                  // We'll also omit optional fields that are not available, they will default to `null`.
                  // Any other fields can be omitted if they are not applicable.
                };
              });

              const newItems = await ctx.prisma.userItem.createMany({
                data: sentItemsTitleArray,
                skipDuplicates: true,
              });

              return {
                status: 201,
                message: "List shared successfully",
                newItems,
              };
            } catch (error) {
              console.error("Error during userItem creation:", error);
              return {
                status: 500,
                message: "An error occurred during item creation.",
              };
            }
          }
        }
      } catch (error) {
        console.log("error: ", error);
        return {
          status: 500,
          message: "An error occurred while processing your request.",
        };
      }
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
  getRecentLists: protectedProcedure.query(({ ctx }) => {
    const results = ctx.prisma.userList.findMany({
      where: {
        parentListId: "undefined",
        NOT: {
          archive: "trash",
        },
      },

      orderBy: { createdAt: "desc" },
      take: 4,
    });

    console.log("results: ", results);

    return results;
  }),

  shareList: protectedProcedure
    .input(shareListSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { userId, listId } = input;
        const results = "hi";
        console.log("input: ", input);
        const senderId = ctx.session.user.id;
        const receiverId = userId;
        // const foundSentUser = await ctx.prisma.user.findFirst({
        //   where: { id: ctx.session.user.id },
        // });
        // console.log("foundSentUser: ", foundSentUser);

        // const foundReceiverUser = await ctx.prisma.user.findFirst({
        //   where: { id: input.userId },
        // });
        // console.log("foundReceiverUser: ", foundReceiverUser);

        //store the relationship between the two users

        const newSharedList = await ctx.prisma.sharedList.create({
          data: {
            senderId,
            receiverId,
            sharedListId: listId,
          },
        });
        return {
          status: 201,
          message: "List shared successfully",
          newSharedList,
        };
      } catch (error) {}
    }),
});
