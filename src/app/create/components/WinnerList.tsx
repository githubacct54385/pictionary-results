"use client";
import { DateTime } from "luxon";
import { Winners } from "@prisma/client";
import DeleteButton from "./DeleteButton";

type WinnerListProps = {
  winners: Winners[];
  onDeleteWinner: (winnerId: string) => Promise<void>;
};

export default function WinnerList(props: WinnerListProps) {
  return (
    <div id="winnerList" className="mt-8">
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
                      <DeleteButton
                        isMobile={false}
                        winnerId={winner.winnerId}
                        onDeleteWinner={props.onDeleteWinner}
                      />
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
                  <DeleteButton
                    isMobile
                    winnerId={winner.winnerId}
                    onDeleteWinner={props.onDeleteWinner}
                  />
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
