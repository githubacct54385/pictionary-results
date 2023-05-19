"use server";

import { Pool } from "pg";
import {
  AddWinnerFailureServerError,
  AddWinnerFailureBadData,
  AddWinnerSuccessResponse,
  DeleteWinnerResponse,
  SavedWinner,
  UnsavedWinner,
} from "./WinnerTypes";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { kv } from "@vercel/kv";
import { z } from "zod";

function createPostgresConnection() {
  return new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: process.env.PGSQL_PORT ? +process.env.PGSQL_PORT : 0,
    database: process.env.PGSQL_DATABASE,
  });
}

const createRedisKey = (userId: string) => `user_${userId}`;

export async function getWinners(userId: string) {
  try {
    const redisKey = createRedisKey(userId);
    const redisResults = await kv.get<SavedWinner[]>(redisKey);
    if (redisResults) {
      return {
        rows: redisResults,
      };
    }
    const conn = createPostgresConnection();

    const query = `
    SELECT *
    FROM Results
    WHERE userId = $1 AND isDeleted = FALSE 
    ORDER BY datetime DESC
    LIMIT 50;`;

    const { rows } = await conn.query(query, [userId]);
    const winnersDto = rows.map((w) => {
      const date = DateTime.fromJSDate(w.datetime).toFormat("MM/dd/yyyy");
      const winnerDto: SavedWinner = {
        id: w.id,
        winner: w.winner,
        animal: w.animal,
        dateString: date,
        artist: w.artist,
      };
      return winnerDto;
    });

    await conn.end();

    await kv.set<SavedWinner[]>(redisKey, winnersDto);

    return {
      rows: winnersDto,
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
    const conn = createPostgresConnection();

    const query = `UPDATE Results SET isDeleted = TRUE WHERE id = $1`;
    await conn.query(query, [winnerId]);
    await conn.end();
    await kv.del(createRedisKey(userId));
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: `Failed to delete winner` };
  }
}

export async function addResult(
  data: UnsavedWinner,
  userId: string
): Promise<
  | AddWinnerSuccessResponse
  | AddWinnerFailureBadData
  | AddWinnerFailureServerError
> {
  try {
    const winner = z.object({
      winner: z.string().min(3).max(100),
      animal: z.string().min(3).max(100),
      artist: z.string().min(3).max(100),
      userId: z.string().min(32).max(32),
    });

    const parseResult = winner.safeParse({ ...data, userId });
    if (!parseResult.success) {
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

    const id = randomUUID();
    const dateString = new Date().toUTCString()
    const conn = createPostgresConnection();
    const query = `INSERT into results (id, datetime, animal, winner, artist, userId, isDeleted) values ($1, $2, $3, $4, $5, $6, $7)`;
    await conn.query(query, [
      id,
      dateString,
      parseResult.data.animal,
      parseResult.data.winner,
      parseResult.data.artist,
      userId,
      0,
    ]);
    await conn.end();

    await kv.del(createRedisKey(userId));
    return {
      success: true,
      newWinner: { ...parseResult.data, id, dateString }
    };
  } catch (error) {
    console.log(error);
    return {
      id: randomUUID(),
      errorMessage: "A server error occurred while adding a winner.",
    };
  }
}
