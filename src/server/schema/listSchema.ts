import * as z from "zod";

export const addListSchema = z.object({
  listTitle: z.string(),
});

export type AddListSchema = z.TypeOf<typeof addListSchema>;
