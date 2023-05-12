"use client";   
import { useEffect, useState } from "react";
import { Winner } from "./Winner";

export default function WinnerList({
  onRequestWinners,
}: {
  onRequestWinners: () => Promise<Winner[]>;
}) {
  const [winners, setWinners] = useState<Winner[]>([]);
  useEffect(() => {
    onRequestWinners().then((winners) => {
      setWinners(winners);
    });
  }, [onRequestWinners]);
  return (
    <div>
      <div>
        {winners.map((winner) => (
          <span key={winner.id}>
            Animal: {winner.animal} Winner: {winner.winner} Date:{" "}
            {winner.dateString}, artist: {winner.artist}
          </span>
        ))}
      </div>
    </div>
  );
}
