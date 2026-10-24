import { Inter, Playfair_Display } from "next/font/google";
import Navigation from "./core/navigation";
import "./globals.css";
import Footer from "./core/footer";
import Analytics from "./core/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Rat City Homebrew Club",
    template: "%s · Rat City Homebrew Club",
  },
  description: "Seattle's community of passionate homebrewers — brewing, sharing, and celebrating craft beer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Analytics />
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
