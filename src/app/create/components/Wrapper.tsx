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
    props
      .onGetWinners()
      .then((w) => {
        setWinners(w);
        setIsLoading(false);
      })
      .catch(() => {
        console.error("Loading failed on getting winners");
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
    animal: string,
    artist: string
  ) {
    const res = await props.onCreateWinner(winner, animal, artist);
    if (res.success && res.newWinner) {
      setWinners([...winners, res.newWinner]);
    }
    return res;
  }

  return (
    <main>
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
    </main>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full border-t-2 border-b-2 border-blue-500 h-12 w-12"></div>
    </div>
  );
}
