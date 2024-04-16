import { Inter } from "next/font/google";
import Image from "next/image";
import Link from 'next/link';
import NavBar from "./navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rat City Homebrew Club",
  description: "Rat City Homebrew Club",
};

export const links = [
  {'name': 'Home', 'href': '/' },
  {'name': 'About', 'href': '/about' },
  {'name': 'Calendar', 'href': '/calendar' },
  {'name': 'Contact', 'href': '/contact' },
  {'name': 'Membership', 'href': '/membership' },
]

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-left justify-between p-24">
          <div id="header">
            <Image
              src="/images/header.jpg"
              alt="Rat City Homebrew Club Header Image"
              width={1000}
              height={500}
            />
          </div>
          <NavBar />
        </div>
        <div className={inter.className}>{children}</div>
      </body>
    </html>
  );
}
