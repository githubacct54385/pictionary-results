"use client";

import { useState } from "react";

type DeleteButtonProps = {
  onDeleteWinner: (winnerId: string) => Promise<void>;
  winnerId: string;
};

export default function DeleteButton(props: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <button
      disabled={isDeleting}
      onClick={async () => {
        setIsDeleting(true);
        await props.onDeleteWinner(props.winnerId);
        setIsDeleting(false);
      }}
      id="winner-delete-button"
      className="invisible w-1/2 rounded-lg bg-emerald-500 py-1 text-xs opacity-0 transition-opacity duration-300 ease-in-out hover:bg-emerald-600 group-hover:visible group-hover:opacity-100"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
