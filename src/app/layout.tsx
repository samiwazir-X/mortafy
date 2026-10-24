import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mortafy — Global Mortgage Intelligence",
    template: "%s | Mortafy",
  },
  description:
    "Mortgage intelligence, simplified. Multi-jurisdictional mortgage, Canadian semi-annual compounding, South Asian Lakh/Crore Home Loan EMI, and Islamic Diminishing Musharakah calculator across 11 global markets (US, PK, GB, AE, CA, EU, AU, SA, IN, SG, HK).",
  applicationName: "Mortafy",
  manifest: "/manifest.json",
  keywords: [
    "Mortafy",
    "mortgage calculator",
    "Islamic mortgage calculator",
    "Diminishing Musharakah",
    "Canadian mortgage calculator",
    "Home Loan EMI calculator India",
    "Singapore BSD stamp duty calculator",
    "UAE DLD mortgage calculator",
    "UK Stamp Duty SDLT calculator",
    "Pakistan house loan calculator",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mortafy",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Mortafy",
    title: "Mortafy — Global Mortgage Intelligence",
    description:
      "Mortgage intelligence, simplified. Compare Conventional & Islamic Diminishing Musharakah financing, local stamp duties, CMHC/PMI, and early payoff across 11 global markets.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortafy — Global Mortgage Intelligence",
    description:
      "Multi-jurisdictional mortgage & Islamic Musharakah intelligence across US, UK, CA, UAE, PK, EU, AU, SA, IN, SG, and HK.",
  },
  icons: {
    icon: [
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#130936",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen selection:bg-[#A82FFC] selection:text-white">
        {children}
      </body>
    </html>
  );
}
