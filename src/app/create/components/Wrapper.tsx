"use client";

import { Winners } from "@prisma/client";
import { useEffect, useState } from "react";
import { createWinner, deleteWinner, getWinners } from "../serverActions";
import CreateForm from "./CreateForm";
import WinnerList from "./WinnerList";

type WrapperProps = {
  onGetWinners: typeof getWinners;
  onDeleteWinner: typeof deleteWinner;
  onCreateWinner: typeof createWinner;
};

export default function Wrapper(props: WrapperProps) {
  const [winners, setWinners] = useState<Winners[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    props.onGetWinners().then((w) => {
      setWinners(w);
      setIsLoading(false);
    });
  }, [props]);

  async function handleDelete(winnerId: string) {
    const res = await props.onDeleteWinner(winnerId);
    if (res) {
      setWinners(winners.filter((p) => p.winnerId !== winnerId));
    }
  }

  async function handleCreateWinner(
    winner: string,
    artist: string,
    animal: string
  ) {
    const res = await props.onCreateWinner(winner, animal, artist);
    if (res.success && res.newWinner) {
      setWinners([...winners, res.newWinner]);
    }
    return res;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-3/4 md:w-1/2 lg:w-3/5">
        <CreateForm onCreateWinner={handleCreateWinner} />
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <WinnerList
              winners={winners}
              onDeleteWinner={async (winnerId) => await handleDelete(winnerId)}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function Loading() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}
