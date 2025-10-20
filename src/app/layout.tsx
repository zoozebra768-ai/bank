import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rory Bank - Online Banking",
  description: "Modern online banking experience with Rory Bank",
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
