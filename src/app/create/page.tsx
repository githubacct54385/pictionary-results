import { db } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import WinnerList from "./WinnerList";
import { UnsavedWinner, SavedWinner } from "./WinnerTypes";
import { revalidatePath } from "next/cache";
import CreateForm from "./CreateForm";
import { currentUser } from "@clerk/nextjs";
import { DateTime } from "luxon";

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
      const winners =
        await client.sql`SELECT *
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
      return winnersDto;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CreateForm onSaveWinner={addResult} />
      <WinnerList onRequestWinners={getWinners} onDelete={deleteWinner} />
    </main>
  );
}
