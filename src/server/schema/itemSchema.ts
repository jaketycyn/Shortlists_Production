import * as z from "zod";

export const addItemSchema = z.object({
  itemTitle: z.string(),
});

export const deleteItemSchema = z.object({
  itemId: z.string(),
  userId: z.string(),
});

export const updateItemSchema = deleteItemSchema.extend({
  title: z.string(),
});

export type AddItemSchema = z.TypeOf<typeof addItemSchema>;
export type DeleteItemSchema = z.TypeOf<typeof deleteItemSchema>;
export type UpdateItemSchema = z.TypeOf<typeof updateItemSchema>;
