import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forex Rates - Live Currency Exchange | Rory Bank",
  description: "Get real-time forex rates and currency exchange information. Track USD, EUR, GBP, and other major currencies with Rory Bank's live forex rates.",
  keywords: [
    "forex rates",
    "currency exchange",
    "USD to GHS",
    "EUR to GHS",
    "live exchange rates",
    "foreign exchange",
    "Rory Bank forex"
  ],
  openGraph: {
    title: "Forex Rates - Live Currency Exchange | Rory Bank",
    description: "Get real-time forex rates and currency exchange information with Rory Bank.",
    url: "https://rorybank.com/forex",
  },
};

export default function ForexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
