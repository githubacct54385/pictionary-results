"use client";
import WinnerList from "./WinnerList";
import CreateForm from "./CreateForm";
import { useAuth } from "@clerk/nextjs";

export default async function Create() {
  const { userId } = useAuth();
  if(!userId) {
    return null;
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-3/4 md:w-1/2 lg:w-3/5">
        <CreateForm userId={userId} />
        <WinnerList />
      </div>
    </main>
  );
}
