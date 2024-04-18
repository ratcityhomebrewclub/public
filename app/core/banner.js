'use client';
import Image from "next/image";
import { useEffect } from "react";

export default function Banner() {
  useEffect(() => {
    const startPos = (window.innerWidth > 750) ? -350 : -200 ;
    document.querySelector("#header").style.backgroundPositionY = startPos + "px";
    window.addEventListener("scroll", function () {
      let offset = window.scrollY;
      const parallax = document.querySelector("#header");
      parallax.style.backgroundPositionY = startPos + offset * 0.7 + "px";
    });
  });

  return (
    <div id="header" className="mb-6 max-w-full">
    </div>
  );
}


