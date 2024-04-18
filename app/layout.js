import { Inter } from "next/font/google";
import Navigation from "./core/navigation";
import "./globals.css";
import Footer from "./core/footer";
import Banner from "./core/banner";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rat City Homebrew Club",
  description: "Rat City Homebrew Club",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col justify-between max-w-full px-5 min-h-screen" >
          <Banner />
          <Navigation />
          <div className="flex justify-center mt-5">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
