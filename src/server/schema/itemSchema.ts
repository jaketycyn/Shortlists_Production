import * as z from "zod";

export const addItemSchema = z.object({
  itemTitle: z.string(),
  listId: z.string(),
});

export const archiveItemsSchema = z.object({
  userId: z.string(),
  listId: z.string(),
  archiveStatus: z.string(),
});

export const archiveItemSchema = z.object({
  userId: z.string(),
  itemId: z.string(),
  listId: z.string(),
  archiveStatus: z.string(),
});

export const deleteItemSchema = z.object({
  itemId: z.string(),
  userId: z.string(),
  listId: z.string(),
});

export const updateItemSchema = z.object({
  itemId: z.string(),
  userId: z.string(),
  listId: z.string(),
  title: z.string(),
});

export const updateItemRankSchema = z.object({
  itemId: z.string(),
  listId: z.string(),
  userId: z.string(),
  potentialRank: z.number(),
});

export const updateItemsRankSchema = z.array(updateItemRankSchema);

export type AddItemSchema = z.TypeOf<typeof addItemSchema>;
export type ArchiveItemSchema = z.TypeOf<typeof archiveItemSchema>;
export type ArchiveItemsSchema = z.TypeOf<typeof archiveItemsSchema>;
export type DeleteItemSchema = z.TypeOf<typeof deleteItemSchema>;
export type UpdateItemSchema = z.TypeOf<typeof updateItemSchema>;
export type UpdateItemRankSchema = z.TypeOf<typeof updateItemRankSchema>;
export type UpdateItemsRankSchema = z.TypeOf<typeof updateItemsRankSchema>;
