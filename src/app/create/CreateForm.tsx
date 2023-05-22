"use client";
import Link from "next/link";
import { useState } from "react";
import { addResult } from "./Actions";

interface CreateFormProps {
  userId: string;
}

export default function CreateForm(props: CreateFormProps) {
  const { userId } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ id: string; msg: string }[]>([]);

  async function handleAction(formData: FormData) {
    setIsSubmitting(true);
    try {
      const res = await addResult(formData, userId);
      if ("errorMessages" in res) {
        setErrors(res.errorMessages);
      }
      console.log(`not submitting`);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form action={handleAction} className="flex flex-col space-y-4 p-4">
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
      {errors && errors.length > 0 && (
        <div>{errors.map((e) => e.msg).join(", ")}</div>
      )}
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
        className={`px-4 py-2 rounded-md text-white ${
          isSubmitting
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isSubmitting ? "Loading..." : "Add result"}
      </button>
    </form>
  );
}
