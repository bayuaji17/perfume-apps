import { z } from "zod";

export const imageFileScheme = z
  .instanceof(File)
  .refine(
    (file) => file.size > 0 && file.size <= 4 * 1024 * 1024, 
    "Image must be between 0-4MB"
  )
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only .jpg, .png, and .webp formats are supported"
  );
