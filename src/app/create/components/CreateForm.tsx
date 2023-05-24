"use client";
import Link from "next/link";
import { useState } from "react";
import { createWinner } from "../serverActions";

type CreateFormProps = {
  onCreateWinner: typeof createWinner;
};

export default function CreateForm(props: CreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [artist, setArtist] = useState("");
  const [winner, setWinner] = useState("");
  const [animal, setAnimal] = useState("");

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex justify-start">
      <Link
        href="/"
        className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
      >
        Go Back
      </Link>

      </div>
      {errors && errors.length > 0 && (
        <div className="bg-white rounded-md border border-gray-300 shadow p-4">
          {errors.map((e, index) => (
            <div
              key={index}
              className="text-black py-1 border-gray-200 last:border-b-0"
            >
              {e}
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
        name="winner"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Winner"
      />
      <input
        type="text"
        value={animal}
        onChange={(e) => setAnimal(e.target.value)}
        name="animal"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Animal"
      />
      <input
        type="text"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        name="artist"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Artist"
      />
      <button
        type="submit"
        onClick={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          const res = await props.onCreateWinner(winner, animal, artist);
          if (res.success && res.newWinner) {
            setAnimal("");
            setArtist("");
            setWinner("");
          } else if (res.errors.length > 0) {
            setErrors(res.errors);
          }
          setIsSubmitting(false);
        }}
        disabled={isSubmitting || !artist || !winner || !animal}
        className={`px-4 py-2 rounded-md text-white ${
          isSubmitting || !artist || !winner || !animal
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Add result"}
      </button>
    </div>
  );
}
