import exp from "constants";
import * as z from "zod";

export const addListSchema = z.object({
  listTitle: z.string(),
  category: z.string(),
});

export const archiveListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
  archive: z.string(),
});

export const deleteListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
});

export const getListsByUserIdSchema = z.object({
  userId: z.string(),
});

export const copyListSchema = z.object({
  userId: z.string(),
  parentListUserId: z.string(),
  listTitle: z.string(),
  listId: z.string(),
  category: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      title: z.string(),
      createdAt: z.date(),
    })
  ),
});

export const shareListSchema = z.object({
  userId: z.string(),
  parentListUserId: z.string(),
  listId: z.string(),
});

export const updateListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
  title: z.string(),
});

export type AddListSchema = z.TypeOf<typeof addListSchema>;
export type ArchiveListSchema = z.TypeOf<typeof archiveListSchema>;
export type DeleteListSchema = z.TypeOf<typeof deleteListSchema>;
export type GetListsByUserIdSchema = z.TypeOf<typeof getListsByUserIdSchema>;
export type ShareListSchema = z.TypeOf<typeof shareListSchema>;
export type CopyListSchema = z.TypeOf<typeof copyListSchema>;
export type UpdateListSchema = z.TypeOf<typeof updateListSchema>;
