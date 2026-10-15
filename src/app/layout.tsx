import type { Metadata } from "next";
import { Inter_Tight, Noto_Serif_Display } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["cyrillic", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerifDisplay = Noto_Serif_Display({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: "Кварта — кофе, обжаренный в четверг",
  description:
    "Небольшая кофейная обжарка в Минске. Свежие зёрна, обжарка по четвергам и доставка по пятницам. Подписка и кофе от 26 BYN.",
  openGraph: {
    title: "Кварта — кофе, обжаренный в четверг",
    description: "Кофе с характером. Маленькие партии, свежая обжарка, доставка по Минску.",
    type: "website",
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${interTight.variable} ${notoSerifDisplay.variable}`}>{children}</body>
    </html>
  );
}
