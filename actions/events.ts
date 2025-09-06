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

export async function getUserEvents() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("user not found.");
  }

  const events = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return { events, username: user.username };
}

export async function deleteEvent(eventId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("user not found.");
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unauthorized.");
  }

  await db.event.delete({
    where: { id: event.id },
  });

  return { sucess: true };
}
