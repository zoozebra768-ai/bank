import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rory Bank - Online Banking",
  description: "Modern online banking experience with Rory Bank",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: { url: '/apple-touch-icon.png' },
    shortcut: { url: '/favicon.ico' }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#D97706" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
