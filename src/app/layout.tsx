import "./globals.css";
import { Inter } from "next/font/google";
// import { ClerkProvider } from "@clerk/nextjs";

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
    // <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    // </ClerkProvider>
  );
}
