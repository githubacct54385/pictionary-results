export type SavedWinner = {
    id: string;
    animal: string;
    winner: string;
    dateString: string;
    artist: string;
}

export type UnsavedWinner = Pick<SavedWinner, "animal" | "winner" | "artist">;

export type DeleteWinnerResponse = {success: boolean} | {error: string};
