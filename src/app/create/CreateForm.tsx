"use client";
import { useState } from "react";
import Link from "next/link";
import { addResult } from "./Actions";
import { useAuth } from "@clerk/nextjs";

export default function CreateForm() {
  const [winner, setWinner] = useState<string>("");
  const [animal, setAnimal] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{id: string, msg: string}[]>([]);
  const { userId } = useAuth();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if(!userId) {
          return;
        }
        setIsLoading(true);
        setErrors([]);
        addResult({
          animal,
          winner,
          artist,
        }, userId).then(res => {
          if("errorMessage" in res && "id" in res) {
            setErrors([{id: res.id, msg: res.errorMessage}]);
          }
          else if("errorMessages" in res) {
            setErrors(res.errorMessages);
          }
          else if("success" in res) {
            setWinner("");
            setAnimal("");
            setArtist("");
          }
          setIsLoading(false);
        });
      }}
      className="flex flex-col space-y-4 p-4"
    >
      <Link
        href="/"
        className="inline-flex items-center justify-center mb-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Go Back
      </Link>
      {errors?.length > 0 && (errors.map((e) => <span key={e.id}>{e.msg}</span>))}
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
          (isLoading || (!winner || !animal || !artist)) 
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isLoading ? "Loading..." : "Add result"}
      </button>
    </form>
  );
}
