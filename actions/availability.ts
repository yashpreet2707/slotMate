"use server";
import { db } from "@/prisma";
export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}
import { auth } from "@clerk/nextjs/server";

type DayAvailability = {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
};

type AvailabilityData = {
  timeGap: number;
  monday?: DayAvailability;
  tuesday?: DayAvailability;
  wednesday?: DayAvailability;
  thursday?: DayAvailability;
  friday?: DayAvailability;
  saturday?: DayAvailability;
};

export async function getUserAvailability() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized User");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: {
        include: { days: true },
      },
    },
  });

  if (!user || !user.availability) {
    return null;
  }

  const availabilityData: AvailabilityData = {
    timeGap: user.availability.timeGap,
  };

  (
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const
  ).forEach((day) => {
    const dayAvailability = user.availability!.days.find(
      (d) => d.day === day.toUpperCase()
    );

    availabilityData[day] = {
      isAvailable: !!dayAvailability, // if day Availability exists, then it's true, else it's false
      startTime: dayAvailability
        ? dayAvailability.startTime.toISOString().slice(11, 16)
        : "09:00",
      endTime: dayAvailability
        ? dayAvailability.endTime.toISOString().slice(11, 16)
        : "17:00",
    };
  });

  return availabilityData;
}

export async function updateAvailability(data: AvailabilityData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized User");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const availabilityData = Object.entries(data).flatMap(
    ([dayOfWeek, dayValue]) => {
      if (!dayValue) return []; // skip if undefined

      const { isAvailable, startTime, endTime } = dayValue as DayAvailability;
      if (isAvailable) {
        const baseDate = new Date().toISOString().split("T")[0];

        return [
          {
            day: DayOfWeek[dayOfWeek.toUpperCase() as keyof typeof DayOfWeek],
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
          },
        ];
      }
      return [];
    }
  );

  if (user.availability) {
    await db.availability.update({
      where: { id: user.availability.id },
      data: {
        timeGap: data.timeGap,
        days: {
          deleteMany: {}, // remove old days
          create: availabilityData.map((d) => ({
            day: d.day as DayOfWeek,
            startTime: d.startTime,
            endTime: d.endTime,
          })),
        },
      },
    });
  } else {
    await db.availability.create({
      data: {
        userId: user.id,
        timeGap: data.timeGap,
        endTime:
          availabilityData.length > 0
            ? availabilityData
                .map((d) => d.endTime)
                .reduce((latest, curr) => (curr > latest ? curr : latest))
            : new Date(),
        days: {
          create: availabilityData.map((d) => ({
            day: d.day as DayOfWeek,
            startTime: d.startTime,
            endTime: d.endTime,
          })),
        },
      },
    });
  }

  return { success: true };
}
