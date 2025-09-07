import z from "zod/v3";

export const userNameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Usernames can only contain letters, numbers, and underscores."
    ),
});

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less."),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less."),
  duration: z.number().int().positive("Duration must be a positive number"),
  isPrivate: z.boolean(),
});

export const daySchema = z
  .object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isAvailable) {
        return (
          data.startTime !== undefined &&
          data.endTime !== undefined &&
          data.startTime < data.endTime
        );
      }
      return true ;
    },
    {
      message: "End time must be more than start time.",
      path: ["endTime"],
    }
  );

export const availabilitySchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, "Time Gap must be more than 0 minutes").int(),
});
