export type SavedWinner = {
    id: string;
    animal: string;
    winner: string;
    dateString: string;
    artist: string;
}

export type UnsavedWinner = Pick<SavedWinner, "animal" | "winner" | "artist">;

export type DeleteWinnerResponse = {success: boolean} | {error: string};

export type AddWinnerSuccessResponse = {
    success: boolean;
    newWinner: SavedWinner;
};

export type AddWinnerFailureBadData = {
    errorMessages: {id: string, msg: string}[];
};

export type AddWinnerFailureServerError = {
    id: string;
    errorMessage: string;
};
export type AddWinnerResponse = AddWinnerSuccessResponse | AddWinnerFailureBadData | AddWinnerFailureServerError;
