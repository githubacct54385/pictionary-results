import { db } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import WinnerList from "./WinnerList";
import { UnsavedWinner, SavedWinner } from "./WinnerTypes";
import { revalidatePath } from "next/cache";
import CreateForm from "./CreateForm";
import { currentUser } from "@clerk/nextjs";
import { DateTime } from "luxon";
import { kv } from "@vercel/kv";

export default async function Create() {
  async function addResult(data: UnsavedWinner) {
    "use server";
    const client = await db.connect();
    try {
      const loggedInUser = await currentUser();
      await client.sql`
      INSERT INTO Results (id, datetime, animal, winner, artist, email) 
      VALUES (${uuidv4()}, ${new Date().toUTCString()}, ${data.animal}, ${
        data.winner
      }, ${data.artist}, ${loggedInUser?.emailAddresses[0].emailAddress});`;

      await kv.del(`user_${loggedInUser?.emailAddresses[0].emailAddress}`);
    
    } catch (error) {
      console.log(error);
    }
    revalidatePath("/create");
  }

  async function deleteWinner(winnerId: string) {
    "use server";
    const client = await db.connect();
    try {
      await client.sql`DELETE FROM Results WHERE id = ${winnerId}`;
      
      const loggedInUser = await currentUser();
      await kv.del(`user_${loggedInUser?.emailAddresses[0].emailAddress}`);

    } catch (error) {
      console.log(error);
    }
    revalidatePath("/create");
  }

  async function getWinners() {
    "use server";
    try {
      const client = await db.connect();
      const loggedInUser = await currentUser();

      const redisResult = await kv.get<SavedWinner[]>(
        `user_${loggedInUser?.emailAddresses[0].emailAddress}`
      );
      if (redisResult) {
        return redisResult;
      }

      const winners = await client.sql`SELECT *
        FROM Results
        WHERE Email = ${loggedInUser?.emailAddresses[0].emailAddress}
        ORDER BY datetime DESC
        LIMIT 50;`;
      const winnersDto = winners.rows.map((w) => {
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
      await kv.set<SavedWinner[]>(
        `user_${loggedInUser?.emailAddresses[0].emailAddress}`,
        winnersDto
      );
      return winnersDto;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-3/4 md:w-1/2 lg:w-3/5">
        <CreateForm onSaveWinner={addResult} />
        <WinnerList onRequestWinners={getWinners} onDelete={deleteWinner} />
      </div>
    </main>
  );
}
