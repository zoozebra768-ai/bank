import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Rory Bank - Modern Online Banking | Zero Fees, High-Yield Savings",
    template: "%s | Rory Bank"
  },
  description: "Experience modern banking with Rory Bank. Zero monthly fees, 2.5% APY savings, instant transfers, and bank-level security. Join 2M+ customers who trust us with their finances.",
  keywords: [
    "online banking",
    "digital bank",
    "zero fees banking",
    "high yield savings",
    "mobile banking",
    "secure banking",
    "instant transfers",
    "Ghana banking",
    "financial services",
    "banking app"
  ],
  authors: [{ name: "Rory Bank" }],
  creator: "Rory Bank",
  publisher: "Rory Bank",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rorybank.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rorybank.com',
    siteName: 'Rory Bank',
    title: 'Rory Bank - Modern Online Banking | Zero Fees, High-Yield Savings',
    description: 'Experience modern banking with Rory Bank. Zero monthly fees, 2.5% APY savings, instant transfers, and bank-level security.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rory Bank - Modern Online Banking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rory Bank - Modern Online Banking | Zero Fees, High-Yield Savings',
    description: 'Experience modern banking with Rory Bank. Zero monthly fees, 2.5% APY savings, instant transfers, and bank-level security.',
    images: ['/twitter-image.jpg'],
    creator: '@rorybank',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Rory Bank",
    "description": "Modern online banking with zero fees, high-yield savings, and bank-level security",
    "url": "https://rorybank.com",
    "logo": "https://rorybank.com/logo.png",
    "image": "https://rorybank.com/og-image.jpg",
    "telephone": "+233-30-123-4567",
    "email": "support@rorybank.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Independence Avenue",
      "addressLocality": "Accra",
      "addressCountry": "GH"
    },
    "openingHours": "Mo-Fr 08:00-17:00, Sa 09:00-14:00",
    "sameAs": [
      "https://twitter.com/rorybank",
      "https://facebook.com/rorybank",
      "https://linkedin.com/company/rorybank"
    ],
    "serviceType": [
      "Online Banking",
      "Savings Accounts",
      "Checking Accounts",
      "Credit Cards",
      "Personal Loans",
      "Mobile Banking"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Ghana"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Banking Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "BankAccount",
            "name": "High-Yield Savings Account",
            "description": "Earn 2.5% APY with no monthly fees"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "BankAccount",
            "name": "Zero-Fee Checking Account",
            "description": "No monthly maintenance fees, free ATM withdrawals"
          }
        }
      ]
    }
  };

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#D97706" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`antialiased ${poppins.className}`}>
        {children}
      </body>
    </html>
  );
}
