import * as z from "zod";

export const addItemSchema = z.object({
  itemTitle: z.string(),
  listId: z.string(),
});

export const addSongItemSchema = z.object({
  itemTitle: z.string(),
  album: z.string(),
  year: z.number().int(),
  artist: z.string(),
  listId: z.string(),
});

export const archiveItemsSchema = z.object({
  userId: z.string(),
  listId: z.string(),
  archive: z.string(),
});

export const archiveItemSchema = z.object({
  userId: z.string(),
  itemId: z.string(),
  listId: z.string(),
  archive: z.string(),
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

export const addSongItemsSchema = z.array(addSongItemSchema);
export const updateItemsRankSchema = z.array(updateItemRankSchema);

export type AddItemSchema = z.TypeOf<typeof addItemSchema>;
export type addSongItemSchema = z.TypeOf<typeof addSongItemSchema>;
export type addSongItemsSchema = z.TypeOf<typeof addSongItemsSchema>;
export type ArchiveItemSchema = z.TypeOf<typeof archiveItemSchema>;
export type ArchiveItemsSchema = z.TypeOf<typeof archiveItemsSchema>;
export type DeleteItemSchema = z.TypeOf<typeof deleteItemSchema>;
export type UpdateItemSchema = z.TypeOf<typeof updateItemSchema>;
export type UpdateItemRankSchema = z.TypeOf<typeof updateItemRankSchema>;
export type UpdateItemsRankSchema = z.TypeOf<typeof updateItemsRankSchema>;
