import * as z from "zod";

export const addListSchema = z.object({
  listTitle: z.string(),
});

export const deleteListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
});

export const archiveListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
  archiveStatus: z.string(),
});

export const updateListSchema = z.object({
  listId: z.string(),
  userId: z.string(),
  title: z.string(),
});

export type AddListSchema = z.TypeOf<typeof addListSchema>;
export type ArchiveListSchema = z.TypeOf<typeof archiveListSchema>;
export type DeleteListSchema = z.TypeOf<typeof deleteListSchema>;
export type UpdateListSchema = z.TypeOf<typeof updateListSchema>;
