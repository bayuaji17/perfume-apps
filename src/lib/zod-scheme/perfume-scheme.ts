import { z } from "zod";
import { ConcentrationType, GenderCategory, NoteRole } from "@prisma/client";
export const perfumeNoteSchema = z.object({
  role: z.nativeEnum(NoteRole),
  description: z.string().min(1, "Note description is required"),
});

export const perfumeScheme = z.object({
  name: z.string().min(1, { message: "Perfume name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  concentration: z.nativeEnum(ConcentrationType, {
    errorMap: () => ({ message: "Please select a valid concentration type" }),
  }),
  sizeML: z.coerce
    .number({
      invalid_type_error: "Ukuran harus berupa angka",
      required_error: "Ukuran harus diisi",
    })
    .int("Size must be a whole number")
    .positive("Size must be a positive number")
    .min(1, { message: "Size must be at least 1ml" }),
  price: z.coerce
    .number({
      invalid_type_error: "Harga harus berupa angka",
      required_error: "Harga harus diisi",
    })
    .int()
    .positive("Price must be a positive number")
    .min(1, { message: "Price is required" }),
  brandId: z.string().min(1, { message: "Brand is required" }),
  gender: z.nativeEnum(GenderCategory, {
    errorMap: () => ({ message: "Please select a valid gender category" }),
  }),
  notes: z.array(perfumeNoteSchema),
});

export const brandScheme = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export const formScheme = z.object({
  name: z.string().min(1, "Name is required"),
  brandId: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  concentration: z.nativeEnum(ConcentrationType),
  gender: z.nativeEnum(GenderCategory),
  sizeML: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: "Size must be greater than 0",
  }),
  price: z.union([z.string(), z.number()]).refine((val) => Number(val) >= 0, {
    message: "Price must be greater than 0",
  }),
  notes: z
    .array(
      z.object({
        role: z.nativeEnum(NoteRole),
        description: z.string().min(1, "Description notes is required"),
      })
    )
    .length(3, "Exactly 3 notes are required"), 
});
