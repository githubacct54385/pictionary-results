"use client";   
import { useEffect, useState } from "react";
import { SavedWinner } from "./WinnerTypes";

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
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="md:overflow-x-auto">
          <table className="md:min-w-full md:divide-y md:divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Winner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {winners.map((winner) => (
                <tr key={winner.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{winner.animal}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{winner.winner}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{winner.artist}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{winner.dateString}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => onDelete(winner.id)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden space-y-4">
            {winners.map((winner) => (
              <div key={winner.id} className="p-4 border border-gray-200 rounded-md space-y-2">
                <p><span className="font-bold">Animal:</span> {winner.animal}</p>
                <p><span className="font-bold">Winner:</span> {winner.winner}</p>
                <p><span className="font-bold">Artist:</span> {winner.artist}</p>
                <p><span className="font-bold">Date:</span> {winner.dateString}</p>
                <button onClick={() => onDelete(winner.id)} className="px-3 py-2 w-full bg-red-500 text-white rounded-md hover:bg-red-600">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
