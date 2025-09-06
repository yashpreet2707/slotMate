"use server";
import { eventSchema } from "@/lib/validator";
import { db } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import z from "zod/v3";

type EventData = z.infer<typeof eventSchema>;

export async function createEvent(data: EventData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized user");
  }

  const validatedData = eventSchema.parse(data);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("user not found.");
  }

  const event = await db.event.create({
    data: {
      ...validatedData,
      userId: user.id,
    },
  });

  return event;
}
