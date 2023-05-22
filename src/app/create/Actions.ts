"use server";

import {
  AddWinnerFailureServerError,
  AddWinnerFailureBadData,
  AddWinnerSuccessResponse,
  DeleteWinnerResponse,
} from "./WinnerTypes";
import { randomUUID } from "crypto";
import { kv } from "@vercel/kv";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Winners } from "@prisma/client";
import { prisma } from '../../db'
import { DateTime } from "luxon";

const createRedisKey = (userId: string) => `user_${userId}`;

export async function getWinners(userId: string): Promise<{rows: Winners[]; userError: string}> {
  try {
    const redisKey = createRedisKey(userId);
    const redisResults = await kv.get<Winners[]>(redisKey);
    if (redisResults) {
      console.log(`read redis`);
      console.log({redisResults});
      return {
        rows: redisResults,
        userError: ""
      };
    }
    console.log(`read db`);
    const rows = await prisma.winners.findMany({
      where: { userId: userId, isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    console.log({rows});

    await kv.set<Winners[]>(redisKey, rows);

    return {
      rows,
      userError: ""
    };
  } catch (error) {
    console.log(error);
    return {
      rows: [],
      userError: `There was an error while retrieving results from the server.`,
    };
  }
}

export async function deleteWinner(
  winnerId: string,
  userId: string
): Promise<DeleteWinnerResponse> {
  try {
    await prisma.winners.update({
      where: {
        winnerId,
      },
      data: {
        isDeleted: true,
      },
    });
    await kv.del(createRedisKey(userId));
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: `Failed to delete winner` };
  }
}

export async function addResult(
  formData: FormData,
  userId: string
): Promise<
  | AddWinnerSuccessResponse
  | AddWinnerFailureBadData
  | AddWinnerFailureServerError
> {
  try {
    console.log(`create`);
    console.log(formData);
    console.log(userId);
    const winnerSchema = z.object({
      winner: z.string().min(3).max(100),
      animal: z.string().min(3).max(100),
      artist: z.string().min(3).max(100),
      userId: z.string().min(32).max(32),
    });

    const winner = formData.get("winner");
    const animal = formData.get("animal");
    const artist = formData.get("artist");

    const parseResult = winnerSchema.safeParse({
      winner,
      animal,
      artist,
      userId,
    });
    if (!parseResult.success) {
      console.log(`unsuccessful parse`);
      return {
        errorMessages: parseResult.error.errors.map((e) => {
          return {
            field: e.path[0].toString(),
            id: randomUUID(),
            msg: `Field: ${e.path[0].toString()} Message: ${e.message}`,
          };
        }),
      };
    }
    
    console.log(`insert db`);
    const newWinner = await prisma.winners.create({
      data: {
        animal: parseResult.data.animal,
        artist: parseResult.data.artist,
        userId: parseResult.data.userId,
        winnerId: randomUUID(),
        winner: parseResult.data.winner,
        createdAt: DateTime.utc().toString()
      },
    });
    console.log(`del redis`);
    await kv.del(createRedisKey(userId));
    revalidatePath("/");
    revalidatePath("/create");
    return {
      success: true,
      newWinner,
    };
  } catch (error) {
    console.log(error);
    return {
      id: randomUUID(),
      errorMessage: "A server error occurred while adding a winner.",
    };
  }
}
