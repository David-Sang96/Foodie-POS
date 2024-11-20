import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const FormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Must be at least one character long" })
    .max(30, { message: "Must not longer than 30 characters" }),
  price: z.number().min(1, { message: "Price must be at least RM1" }),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `The image is too large.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Please upload a valid image file (JPEG, PNG, or WebP)."
    ),
  menuCategoryIds: z
    .array(z.number())
    .nonempty("At least one menu category is required"),
});

export const menuCategoryFormSchema = z.object({
  id: z.number({ message: "Required field id is missing" }),
  companyId: z.number({ message: "Required field company id is missing" }),
  name: z
    .string()
    .trim()
    .min(5, { message: "Name must be at least 5 characters long" }),
  isAvailable: z.boolean(),
});

export const menuFormSchema = z.object({
  id: z
    .number({ message: "Required field id is missing" })
    .gt(0, { message: "Id cannot be zero" }),
  name: z
    .string()
    .trim()
    .min(5, { message: "Name must be at least 5 characters long" }),
  price: z
    .number()
    // .nonnegative({ message: "Price must be positive number" })
    .refine((n) => n > 0, {
      message: "Price is required and must be positive number",
    }),
  isAvailable: z.boolean(),
  menuCategoryIds: z
    .array(z.number())
    .min(1, { message: "Please select at least one menu category" }),
  addonCategoryIds: z
    .array(z.number())
    .min(1, { message: "Please select at least one addon category" }),
  imageUrl: z.string().nullable(),
});
