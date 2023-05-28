import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

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
        <SignedIn>
          <div className="flex items-center justify-center">
            <UserButton />
          </div>
          <div id="goToResults" className="mt-6 flex justify-center">
            <Link
              href="/create"
              className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
            >
              Go To Results
            </Link>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-in"
              className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
            >
              Sign up
            </Link>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
