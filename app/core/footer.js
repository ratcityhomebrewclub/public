import Link from "next/link";
import Image from "next/image";

export default function Footer() { 
  const items = [
    {
      "name": "WAHA",
      "img": "/images/waha.png",
      "url":  "https://www.wahomebrewers.org/"
    },
    {
      "name": "Sound Homebrew Supply",
      "img": "/images/shs.png",
      "url":  "https://soundhomebrew.com/"
    }
  ]

  return (
    <div id="footer" className="flex flex-row lg:basis-4/5 align-center items-center justify-center py-10">
      {items.map((item) => {
        return (
          <Link key={item.name} href={item.url} className="px-2">
            <Image
              src={item.img}
              alt={item.name}
              width={200}
              height= {200}
            />
          </Link>
        );
      })}
    </div>
  );
}
