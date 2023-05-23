"use client";
import { useState } from "react";
import { DateTime } from "luxon";
import { Winners } from "@prisma/client";

type WinnerListProps = {
  winners: Winners[];
  onDeleteWinner: (winnerId: string) => Promise<void>;
};

export default function WinnerList(props: WinnerListProps) {
  
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-8">
      {error && <WinnersError error={error} />}
      <div className="md:overflow-x-auto">
        {props.winners.length === 0 ? (
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
                {props.winners.map((winner) => (
                  <tr key={winner.winnerId}>
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
                      {DateTime.fromISO(winner.createdAt.toString()).toFormat(
                        "MM/dd/yyyy"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => props.onDeleteWinner(winner.winnerId)}
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
              {props.winners.map((winner) => (
                <div
                  key={winner.winnerId}
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
                    {DateTime.fromISO(winner.createdAt.toString()).toFormat(
                      "MM/dd/yyyy"
                    )}
                  </p>
                  <button
                    onClick={() => props.onDeleteWinner(winner.winnerId)}
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
    </div>
  );
}

function WinnersError(props: { error: string }) {
  return <div className="text-center py-4 text-red-600">{props.error}</div>;
}

function Loading() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}
