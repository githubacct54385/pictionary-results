"use client";   
import { useEffect, useState } from "react";
import { SavedWinner } from "./Winner";
import { Spinner } from "./Spinner";

export default function WinnerList({
  onRequestWinners,
  onDelete,
}: {
  onRequestWinners: () => Promise<SavedWinner[]>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [winners, setWinners] = useState<SavedWinner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    onRequestWinners().then((winners) => {
      setWinners(winners);
      setIsLoading(false);
    });
  }, [onRequestWinners]);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-wrap justify-around">
          {winners.map((winner) => (
            <div key={winner.id} className="p-4 m-2 border border-gray-200 rounded-md shadow-sm w-60">
              <p className="text-lg font-bold">Animal: <span className="font-normal">{winner.animal}</span></p>
              <p className="text-lg font-bold">Winner: <span className="font-normal">{winner.winner}</span></p>
              <p className="text-lg font-bold">Date: <span className="font-normal">{winner.dateString}</span></p>
              <p className="text-lg font-bold">Artist: <span className="font-normal">{winner.artist}</span></p>
              <button onClick={() => onDelete(winner.id)} className="mt-4 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
