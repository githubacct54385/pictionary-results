"use client";
import { Winners } from "@prisma/client";
import DeleteButton from "./DeleteButton";
import NextImage from 'next/image'

type WinnerListProps = {
  winners: Winners[];
  onDeleteWinner: (winnerId: string) => Promise<void>;
};

export default function WinnerList(props: WinnerListProps) {
  return (
    <div className="flex place-content-center">
      <div
        className="flex flex-wrap justify-center gap-2 w-3/4 md:w-2/3"
        id="winner-flex-box"
      >
        {props.winners.length === 0 && (
          <div id="no-winners-text">No winners yet, please add one.</div>
        )}
        {props.winners.length > 0 &&
          props.winners.map((winner) => (
            <div
              key="{winner.winnerId}"
              id="winner-card"
              className="group flex w-64 flex-col rounded-b-2xl bg-emerald-300 font-normal text-stone-800"
            >
              <div
                className="flex h-64 w-64 border-x-4 border-t-4 border-emerald-300 border-t-emerald-300"
                id="winner-image-container"
              >
                <NextImage
                  id="winner-image"
                  className="h-full w-full object-cover"
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngkey.com%2Fpng%2Fdetail%2F233-2332677_ega-png.png&f=1&nofb=1&ipt=1799a74bf88e9c393962ca57ebffefa044768c5f4dfac7dacb9ab153132f5f33&ipo=images"
                  alt="Drawing"
                  width={64}
                  height={64}
                />
              </div>
              <div className="flex flex-col" id="winner-details-flex-container">
                <div className="mb-2 flex justify-start ps-3 text-xl font-bold">
                  {winner.animal}
                </div>
                <div className="flex justify-start ps-3 text-xs">
                  Drawn by {winner.artist}
                </div>
                <div className="flex justify-start ps-3 text-xs">
                  Guessed by {winner.winner}
                </div>
                <div className="flex justify-start ps-3">
                  <DeleteButton
                    onDeleteWinner={props.onDeleteWinner}
                    winnerId={winner.winnerId}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
