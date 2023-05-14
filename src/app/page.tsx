import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-3/4 md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to Pictionary Results
        </h1>
        <p className="text-lg mb-6 text-center">
          Keep track of your Pictionary games and winners in a fun and easy way!
        </p>
        <div className="flex items-center justify-center">
          <UserButton />
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href="/create"
            className="px-6 py-2 rounded-md border-2 border-indigo-500 text-indigo-500 font-semibold text-lg hover:bg-indigo-500 hover:text-white"
          >
            Go To Results
          </Link>
        </div>
      </div>
    </main>
  );
}
