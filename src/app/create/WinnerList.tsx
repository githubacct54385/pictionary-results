"use client";   
import { useEffect, useState } from "react";
import { Winner } from "./Winner";

export default function WinnerList({
  onRequestWinners,
  onDelete,
}: {
  onRequestWinners: () => Promise<Winner[]>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [winners, setWinners] = useState<Winner[]>([]);
  useEffect(() => {
    onRequestWinners().then((winners) => {
      setWinners(winners);
    });
  }, [onRequestWinners]);
  return (
    <div className="mt-8">
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
    </div>
  );
}
