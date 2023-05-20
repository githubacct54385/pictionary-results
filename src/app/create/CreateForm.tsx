"use client";
import Link from "next/link";
import { useTransition } from 'react';
import { addResult } from "./Actions";
import { useAuth } from "@clerk/nextjs";

export default function CreateForm() {
  const { userId } = useAuth();
  let [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    startTransition(async () => {
      if(!userId) {
        return;
      }
      await addResult(formData, userId);
    })
  }

  return (
    <form action={handleAction}
      // onSubmit={(e) => {
      //   e.preventDefault();
      //   if(!userId) {
      //     return;
      //   }
      //   setIsLoading(true);
      //   setErrors([]);
      //   addResult({
      //     animal,
      //     winner,
      //     artist,
      //   }, userId).then(res => {
      //     if("errorMessage" in res && "id" in res) {
      //       setErrors([{id: res.id, msg: res.errorMessage}]);
      //     }
      //     else if("errorMessages" in res) {
      //       setErrors(res.errorMessages);
      //     }
      //     else if("success" in res) {
      //       setWinner("");
      //       setAnimal("");
      //       setArtist("");
      //     }
      //     setIsLoading(false);
      //   });
      // }}
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
      <input
        type="text"
        name="winner"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Winner"
      />
      <input
        type="text"
        name="animal"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Animal"
      />
      <input
        type="text"
        name="artist"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Artist"
      />
      <button
        type="submit"
        disabled={isPending}
        className={`px-4 py-2 rounded-md text-white ${
          (isPending) 
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isPending ? "Loading..." : "Add result"}
      </button>
    </form>
  );
}
