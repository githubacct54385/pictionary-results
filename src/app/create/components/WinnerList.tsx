"use client";
import { Winners } from "@prisma/client";
import DeleteButton from "./DeleteButton";

type WinnerListProps = {
  winners: Winners[];
  onDeleteWinner: (winnerId: string) => Promise<void>;
};

export default function WinnerList(props: WinnerListProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2" id="winner-flex-box">
      {props.winners.length === 0 && <div>No winners yet, please add one.</div>}
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
              <img
                id="winner-image"
                className="h-full w-full object-cover"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngkey.com%2Fpng%2Fdetail%2F233-2332677_ega-png.png&f=1&nofb=1&ipt=1799a74bf88e9c393962ca57ebffefa044768c5f4dfac7dacb9ab153132f5f33&ipo=images"
                alt="Drawing"
              />
            </div>
            <div className="flex flex-col" id="winner-details-flex-container">
              <div className="mb-2 flex justify-start ps-3 text-xl font-bold">
                Kangaroo
              </div>
              <div className="flex justify-start ps-3 text-xs">
                Drawn by Alex
              </div>
              <div className="flex justify-start ps-3 text-xs">
                Guessed by Paul
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
  );
}
