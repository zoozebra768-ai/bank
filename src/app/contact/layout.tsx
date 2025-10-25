import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Customer Support | Rory Bank",
  description: "Get in touch with Rory Bank customer support. 24/7 assistance for all your banking needs. Email support@rorybank.com or visit our Accra branch.",
  keywords: [
    "contact Rory Bank",
    "customer support",
    "banking help",
    "Rory Bank support",
    "banking assistance",
    "financial support"
  ],
  openGraph: {
    title: "Contact Us - Customer Support | Rory Bank",
    description: "Get in touch with Rory Bank customer support. 24/7 assistance for all your banking needs.",
    url: "https://rorybank.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
