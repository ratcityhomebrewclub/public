import Link from "next/link";
import Image from "next/image";

export default function Footer() { 
  const items = [
    {
      "name": "WAHA",
      "img": "/images/waha.png",
      "url":  "https://www.wahomebrewers.org/",
      "class": ""
    },
    {
      "name": "Sound Homebrew Supply",
      "img": "/images/shs.png",
      "url":  "https://soundhomebrew.com/",
      "class": "white-background"
    }
  ]

  return (
    <div id="footer" className="flex flex-wrap lg:basis-4/5 align-center items-center justify-center py-10">
      {items.map((item) => {
        return (
          <Link key={item.name} href={item.url} className="px-2 flex">
            <Image
              src={item.img}
              alt={item.name}
              className={item.class}
              width={200}
              height={200}
            />
          </Link>
        );
      })}
    </div>
  );
}
