// import { db } from "@vercel/postgres";
// import { v4 as uuidv4 } from "uuid";
// import WinnerList from "./WinnerList";
// import { UnsavedWinner, SavedWinner } from "./WinnerTypes";
// import { revalidatePath } from "next/cache";
// import CreateForm from "./CreateForm";
// import { currentUser } from "@clerk/nextjs";

export default async function Create() {
  // async function addResult(data: UnsavedWinner) {
  //   "use server";
  //   const client = await db.connect();
  //   try {
  //     const loggedInUser = await currentUser();
  //     await client.sql`
  //     INSERT INTO Results (id, datetime, animal, winner, artist, email) 
  //     VALUES (${uuidv4()}, ${new Date().toUTCString()}, ${data.animal}, ${
  //       data.winner
  //     }, ${data.artist}, ${loggedInUser?.emailAddresses[0].emailAddress});`;
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   revalidatePath("/create");
  // }

  // async function deleteWinner(winnerId: string) {
  //   "use server";
  //   const client = await db.connect();
  //   try {
  //     await client.sql`DELETE FROM Results WHERE id = ${winnerId}`;
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   revalidatePath("/create");
  // }

  // async function getWinners() {
  //   "use server";
  //   try {
  //     const client = await db.connect();
  //     const loggedInUser = await currentUser();
  //     const winners =
  //       await client.sql`SELECT *
  //       FROM Results
  //       WHERE Email = ${loggedInUser?.emailAddresses[0].emailAddress}
  //       ORDER BY datetime DESC
  //       LIMIT 50;`;
  //     const winnersDto = winners.rows.map((w) => {
  //       const date = new Date(w.datetime);

  //       const day = ("0" + date.getDate()).slice(-2);
  //       const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add 1
  //       const year = date.getFullYear();

  //       const dateString2 = `${month}/${day}/${year}`;

  //       const winnerDto: SavedWinner = {
  //         id: w.id,
  //         winner: w.winner,
  //         animal: w.animal,
  //         dateString: dateString2,
  //         artist: w.artist,
  //       };
  //       return winnerDto;
  //     });
  //     return winnersDto;
  //   } catch (error) {
  //     console.log(error);
  //     return [];
  //   }
  // }

  async function dumbServerAction() {
    "use server";
    return "hello world";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{dumbServerAction()}</h1>
      {/* <CreateForm onSaveWinner={addResult} />
      <WinnerList onRequestWinners={getWinners} onDelete={deleteWinner} /> */}
    </main>
  );
}
