import { Inter } from "next/font/google";
import Image from "next/image";
import Link from 'next/link';
import NavBar from "./core/navbar";
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
        <div className="flex flex-col items-left justify-between">
          <div id="header" className="flex flex-row justify-center py-5">
            <Image
              // src="/images/header.jpg"
              src="/images/stock/Firefly mouse making beer 15333.jpg"
              alt="Rat City Homebrew Club Header Image"
              sizes="100vw"
              style={
                {
                  maxWidth: "100%",
                  height: "auto"
                }
              }
              width={1000}
              height={500}
            />
          </div>
          <NavBar />
          <div className="flex justify-center min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
