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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
        </div>
      )}
    </div>
  );
}
