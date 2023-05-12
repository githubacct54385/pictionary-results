import { db } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import WinnerList from "./WinnerList";
import { Winner } from "./Winner";
import { revalidatePath } from "next/cache";
import CreateForm, { UnsavedWinner } from "./CreateForm";
export default async function Create() {
  // async function createTable() {
  //   "use server";
  //   const client = await db.connect();

  //   try {
  //     await client.sql`CREATE TABLE Results (id UUID PRIMARY KEY, datetime TIMESTAMP, animal VARCHAR(255), winner VARCHAR(255), artist VARCHAR(255));`;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function addResult(data: UnsavedWinner) {
    "use server";
    const client = await db.connect();
    try {
      await client.sql`
      INSERT INTO Results (id, datetime, animal, winner, artist) 
      VALUES (${uuidv4()}, ${new Date().toUTCString()}, ${data.animal}, ${data.winner}, ${data.artist});`;
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
    const client = await db.connect();
    const winners = await client.sql`SELECT * FROM RESULTS`;
    const winnersDto = winners.rows.map(w => {
      const date = new Date(w.datetime);
    
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add 1
      const year = date.getFullYear();
    
      const dateString2 = `${month}/${day}/${year}`;

      const winnerDto: Winner = {
        id: w.id,
        winner: w.winner,
        animal: w.animal,
        dateString: dateString2,
        artist: w.artist
      };
      return winnerDto;
    })
    return winnersDto;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CreateForm onSaveWinner={addResult} />
      <WinnerList onRequestWinners={getWinners} onDelete={deleteWinner} />
    </main>
  );
}
