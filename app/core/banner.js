'use client';
import Image from "next/image";
import { useEffect } from "react";

export default function Banner() {
  useEffect(() => {
    console.log("Component Mounted");
    window.addEventListener("scroll", function () {
      const parallax = document.querySelector("#header");
      let offset = window.scrollY;
      parallax.style.backgroundPositionY = offset * 0.7 - 550 + "px";
    });
  });

  return (
    <div id="header" className="flex basis-full justify-center mb-6 max-w-full">
    </div>
  );
}


