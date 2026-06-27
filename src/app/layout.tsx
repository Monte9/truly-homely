import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Truly Homely",
  description: "Browse the Truly Homely menu - home-style dishes, beautifully shown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
