import { prisma } from "@/db";
import { auth } from "@clerk/nextjs";
import { kv } from "@vercel/kv";
import { Winners } from "@prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import Wrapper from "./components/Wrapper";

export const revalidate = 5;

export async function getWinners() {
  "use server";
  const { userId } = auth();
  if (!userId) {
    return [];
  }
  const redisKey = createRedisKey(userId);
  const redisResults = await kv.get<Winners[]>(redisKey);
  if (redisResults) {
    return redisResults;
  }
  const winners = await prisma.winners.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  await kv.set(redisKey, winners);
  return winners;
}

export async function deleteWinner(winnerId: string) {
  "use server";
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const deletedWinner = await prisma.winners.update({
    where: {
      winnerId,
    },
    data: {
      isDeleted: true,
    },
  });
  await kv.del(createRedisKey(userId));
  return deletedWinner;
}

export async function createWinner(
  winner: string,
  animal: string,
  artist: string
) {
  "use server";
  const { userId } = auth();
  if (!userId) {
    return { success: false, errors: ["Not logged in."], newWinner: null };
  }

  const winnerSchema = z.object({
    winner: z.string().min(3).max(100),
    animal: z.string().min(3).max(100),
    artist: z.string().min(3).max(100),
  });
  const parseResult = winnerSchema.safeParse({
    winner,
    artist,
    animal,
  });
  if (!parseResult.success) {
    return {
      success: false,
      errors: parseResult.error.errors.map((e) => e.message),
      newWinner: null
    };
  }
  const newWinner = await prisma.winners.create({
    data: {
      animal: parseResult.data.animal,
      artist: parseResult.data.artist,
      userId: userId,
      winnerId: randomUUID(),
      winner: parseResult.data.winner,
      createdAt: DateTime.utc().toString(),
    },
  });
  await kv.del(createRedisKey(userId));
  return { success: true, errors: [] as string[], newWinner };
}

const createRedisKey = (userId: string) => `user_${userId}`;

export default async function Page() {
  return (
    <Wrapper
      onDeleteWinner={deleteWinner}
      onGetWinners={getWinners}
      onCreateWinner={createWinner}
    />
  );
}
