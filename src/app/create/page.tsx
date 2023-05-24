import Wrapper from "./components/Wrapper";
import { deleteWinner, getWinners, createWinner } from "./serverActions";

export default async function Page() {
  return (
    <Wrapper
      onDeleteWinner={deleteWinner}
      onGetWinners={getWinners}
      onCreateWinner={createWinner}
    />
  );
}
