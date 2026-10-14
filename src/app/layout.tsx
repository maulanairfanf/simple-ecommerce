import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Crumb",
  description: "Thoughtfully baked pastries, delightful cakes, and little moments worth sharing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
