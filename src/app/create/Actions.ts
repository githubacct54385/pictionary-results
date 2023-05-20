"use server";

import { Pool } from "pg";
import {
  AddWinnerFailureServerError,
  AddWinnerFailureBadData,
  AddWinnerSuccessResponse,
  DeleteWinnerResponse,
  SavedWinner,
} from "./WinnerTypes";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { kv } from "@vercel/kv";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import "dotenv/config";
import { connect } from "@planetscale/database";

function createPostgresConnection() {
  return new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: process.env.PGSQL_PORT ? +process.env.PGSQL_PORT : 0,
    database: process.env.PGSQL_DATABASE,
  });
}

function createPlanetScaleConnection() {
  const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  };
  return config;
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

    const planetScaleConn = connect(createPlanetScaleConnection());
    const { rows } = await planetScaleConn.execute(
      `
    SELECT *
    FROM Results
    WHERE userId = ? AND isDeleted = 0 
    ORDER BY datetime DESC
    LIMIT 50;`,
      [userId]
    );

    const winnersDto2 = rows.map((w: any) => {
      const date = DateTime.fromSQL(w.datetime).toFormat("MM/dd/yyyy");
      const winnerDto: SavedWinner = {
        id: w.id,
        winner: w.winner,
        animal: w.animal,
        dateString: date,
        artist: w.artist,
      };
      return winnerDto;
    });

    await kv.set<SavedWinner[]>(redisKey, winnersDto2);

    return {
      rows: winnersDto2,
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
  userId: string | null | undefined
): Promise<DeleteWinnerResponse> {
  try {
    console.log(winnerId, userId);
    if (!userId) return { error: "user is not logged in" };

    const planetScaleConn = connect(createPlanetScaleConnection());
    await planetScaleConn.execute(
      `
      UPDATE Results SET isDeleted = 1 WHERE id = ?`,
      [userId]
    );
    await kv.del(createRedisKey(userId));
    revalidatePath("/");
    revalidatePath("/create");
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
    const dateString = DateTime.now().toUTC().toSQLDate();
    const planetScaleConn = connect(createPlanetScaleConnection());
    await planetScaleConn.execute(
      `
      INSERT into Results (id, datetime, animal, winner, artist, userId, isDeleted) values (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        dateString,
        parseResult.data.animal,
        parseResult.data.winner,
        parseResult.data.artist,
        userId,
        0,
      ]
    );
    // const conn = createPostgresConnection();
    // const query = `INSERT into results (id, datetime, animal, winner, artist, userId, isDeleted) values ($1, $2, $3, $4, $5, $6, $7)`;
    // await conn.query(query, [
    //   id,
    //   dateString,
    //   parseResult.data.animal,
    //   parseResult.data.winner,
    //   parseResult.data.artist,
    //   userId,
    //   0,
    // ]);
    // await conn.end();

    await kv.del(createRedisKey(userId));
    revalidatePath("/create");
    return {
      success: true,
      newWinner: { ...parseResult.data, id, dateString },
    };
  } catch (error) {
    console.log(error);
    return {
      id: randomUUID(),
      errorMessage: "A server error occurred while adding a winner.",
    };
  }
}
