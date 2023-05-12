"use client";
import { useState } from "react";
import { Winner } from "./Winner";

export type UnsavedWinner = Pick<Winner, "animal" | "winner" | "artist">;

export default function CreateForm({
  onSaveWinner,
}: {
  onSaveWinner: (unsavedWinner: UnsavedWinner) => Promise<void>;
}) {
  const [winner, setWinner] = useState<string>("");
  const [animal, setAnimal] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  return (
    <form
      onSubmit={() =>
        onSaveWinner({
          animal,
          winner,
          artist
        }).then(() => {
          setWinner("");
          setAnimal("");
          setArtist("");
        })
      }
    >
      <input
        type="text"
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
      />
      <input
        type="text"
        value={animal}
        onChange={(e) => setAnimal(e.target.value)}
      />
      <input
        type="text"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <button type="submit">Add result</button>
    </form>
  );
}
