"use client";

import { useState } from "react";

type DeleteButtonProps = {
  isMobile: boolean;
  onDeleteWinner: (winnerId: string) => Promise<void>;
  winnerId: string;
};

export default function DeleteButton(props: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const tailwindStyles = () => {
    if (props.isMobile && isDeleting) {
      return "px-3 py-2 w-full text-white rounded-md hover:bg-gray-600 bg-gray-500 cursor-not-allowed";
    } else if (props.isMobile && !isDeleting) {
      return "px-3 py-2 bg-red-500 w-full text-white rounded-md hover:bg-red-600";
    } else if (!props.isMobile && isDeleting) {
      return "px-3 py-2 text-white rounded-md hover:bg-gray-600 bg-gray-500 cursor-not-allowed";
    } else {
      return "px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600";
    }
  };

  return (
    <button
      disabled={isDeleting}
      onClick={async () => {
        setIsDeleting(true);
        await props.onDeleteWinner(props.winnerId);
        setIsDeleting(false);
      }}
      className={tailwindStyles()}
    >
      Delete
    </button>
  );
}
