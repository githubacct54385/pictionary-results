"use client";
import { useState } from "react";
import { UnsavedWinner } from "./WinnerTypes";

export default function CreateForm({
  onSaveWinner,
}: {
  onSaveWinner: (unsavedWinner: UnsavedWinner) => Promise<void>;
}) {
  const [winner, setWinner] = useState<string>("");
  const [animal, setAnimal] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <form
      onSubmit={() => {
        setIsLoading(true);
        onSaveWinner({
          animal,
          winner,
          artist,
        }).then(() => {
          setWinner("");
          setAnimal("");
          setArtist("");
          setIsLoading(false);
        });
      }}
      className="flex flex-col space-y-4 p-4"
    >
      <input
        type="text"
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Winner"
      />
      <input
        type="text"
        value={animal}
        onChange={(e) => setAnimal(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Animal"
      />
      <input
        type="text"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Artist"
      />
      <button
        type="submit"
        className={`px-4 py-2 rounded-md text-white ${
          isLoading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isLoading ? "Loading..." : "Add result"}
      </button>
    </form>
  );
}
