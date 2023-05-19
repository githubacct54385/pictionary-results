"use client";
import { useEffect, useState } from "react";
import { SavedWinner } from "./WinnerTypes";
import { getWinners, deleteWinner } from "./Actions";
import { useAuth } from "@clerk/nextjs";

export default function WinnerList() {
  const [winners, setWinners] = useState<SavedWinner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) {
      return;
    }
    getWinners(userId)
      .then((res) => {
        if (res.userError) {
          setError(res.userError);
        }
        setWinners(res.rows);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  async function onDeleteWinner(winnerId: string) {
    if (!userId) {
      return;
    }
    setError("");
    const result = await deleteWinner(winnerId, userId);
    if ("success" in result) {
      //setWinners(winners.filter((w) => w.id !== winnerId));
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-600">{error}</div>
      ) : (
        <div className="md:overflow-x-auto">
          {winners.length === 0 ? (
            <div className="text-center py-4">
              No winners yet, please add one.
            </div>
          ) : (
            <>
              {/* desktop & tablet */}
              <table className="md:min-w-full md:divide-y md:divide-gray-200 hidden md:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Animal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Winner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Artist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {winners.map((winner) => (
                    <tr key={winner.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winner.animal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winner.winner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winner.artist}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winner.dateString}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onDeleteWinner(winner.id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* end desktop & tablet */}
              {/* mobile */}
              <div className="md:hidden space-y-4">
                {winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="p-4 border border-gray-200 rounded-md space-y-2"
                  >
                    <p>
                      <span className="font-bold">Animal:</span> {winner.animal}
                    </p>
                    <p>
                      <span className="font-bold">Winner:</span> {winner.winner}
                    </p>
                    <p>
                      <span className="font-bold">Artist:</span> {winner.artist}
                    </p>
                    <p>
                      <span className="font-bold">Date:</span>{" "}
                      {winner.dateString}
                    </p>
                    <button
                      onClick={() => onDeleteWinner(winner.id)}
                      className="px-3 py-2 w-full bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              {/* end mobile */}
            </>
          )}
        </div>
      )}
    </div>
  );
}
