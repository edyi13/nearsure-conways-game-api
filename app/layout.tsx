import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game of Life API",
  description: "Conway's Game of Life - Code challenge implementation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}