"use server";

import { db } from "@/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const existingUsername = await db.user.findUnique({
    where: { username },
  });

  if (existingUsername && existingUsername.id !== userId) {
    throw new Error("Username is already taken");
  }

  await db.user.update({
    where: { clerkUserId: userId },
    data: { username },
  });

  const client = await clerkClient();

  await client.users.updateUser(userId, {
    username,
  });

  return { sucess: true };
}
