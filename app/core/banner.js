'use client';
import Image from "next/image";
import "./globals.css";
import { useEffect } from "react";

export default function Banner() {
  useEffect(() => {
    console.log("Component Mounted");
    window.addEventListener("scroll", function () {
      const parallax = document.querySelector(".parallax");
      let offset = window.pageYOffset;
      parallax.style.backgroundPositionY = offset * 0.7 + "px";
    });
  });

  return (
    <div id="header" className="parallaxOne flex flex-row justify-center py-5">
      <h1 className="">Some</h1>
      {/* <Image
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
      /> */}
    </div>

  );
}


