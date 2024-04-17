import Image from "next/image";
import Link from 'next/link';

import socials from 'config/socials.js';

export default function Socials() { 
  return (
    // <div className="container mx-auto px-4">
      <div id="Socials" className="py-2">
        <h2 className="text-3xl font-semibold mb-6">Socials</h2>
        <div className="container mx-auto flex flex-row">
          {socials.map((social) => {
            return (
              <Link key={social.name} href={social.url} className="px-2">
                <Image
                  src={social.img}
                  alt={social.name}
                  width={50}
                  height={50}
                />
              </Link>
            )
          })}
        </div>
      </div>
    // </div>
  );
}