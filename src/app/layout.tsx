import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrinkDeck | The Ultimate Drinking Game",
  description: "Experience Kings and Ring of Fire with premium neon aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
