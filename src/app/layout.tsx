import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pictionary Results",
  description: "CRUD app for pictionary results game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="h-screen w-screen bg-zinc-100 text-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Link href="/" className="px-3 text-xl hover:text-emerald-400">
                  Pictionary Results
                </Link>
              </div>
              <div className="mr-3 hidden md:flex">
                <Link href="/about" className="px-3 hover:text-emerald-400">
                  About
                </Link>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <Link href="/sign-in" className="px-3 hover:text-emerald-400">
                    Sign in
                  </Link>
                  <Link
                    href="/sign-out"
                    className="px-3 hover:text-emerald-400"
                  >
                    Sign out
                  </Link>
                </SignedOut>
              </div>
              <div className="mr-3 flex flex-col md:hidden">
                <Link href="/about" className="hover:text-emerald-400">
                  About
                </Link>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <Link href="/sign-in" className="hover:text-emerald-400">
                    Sign in
                  </Link>
                  <Link href="/sign-out" className="hover:text-emerald-400">
                    Sign out
                  </Link>
                </SignedOut>
              </div>
            </div>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
