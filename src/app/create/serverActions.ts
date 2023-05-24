"use server";

import { prisma } from "@/db";
import { auth } from "@clerk/nextjs";
import { Winners } from "@prisma/client";
import { kv } from "@vercel/kv";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { z } from "zod";

export const getWinners = async () => {
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
  
  export const deleteWinner = async (winnerId: string) => {
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
  
  export const createWinner = async(
    winner: string,
    animal: string,
    artist: string
  ) => {
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