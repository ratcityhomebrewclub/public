import { Inter } from "next/font/google";
import Image from "next/image";
import Link from 'next/link';
import Navigation from "./core/navigation";
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
        <div className="flex flex-col justify-between max-w-full px-5" >
          <div id="header" className="flex basis-full justify-center py-5  max-w-full">
            <Image
              src="/images/header.jpg"
              // src="/images/stock/Firefly mouse making beer 15333.jpg"
              alt="Rat City Homebrew Club Header Image"
              sizes="100vw"
              style={
                {
                  width: "100%",
                  // maxWidth: "fit-content",
                  height: "auto",
                  objectFit: "contain"
                }
              }
              width={1000}
              height={500}
            />
          </div>
          <Navigation />
          <div className="flex justify-center min-h-screen mt-5">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
