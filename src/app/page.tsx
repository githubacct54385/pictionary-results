import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex place-content-center">
      <SignedIn>
        <Link id="goToResults" className="hover:text-emerald-400" href="/create">Go To Results</Link>
      </SignedIn>
    </main>
  );
}
