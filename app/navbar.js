
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from 'next/link';

export const links = [
  {'name': 'Home', 'href': '/' },
  {'name': 'About', 'href': '/about' },
  {'name': 'Calendar', 'href': '/calendar' },
  {'name': 'Calculators', 'href': '/calculators' },
  {'name': 'Contact', 'href': '/contact' },
  {'name': 'Membership', 'href': '/membership' },
  {'name': 'Useful Links', 'href': '/links' },
]

export default function NavBar() { 
  return (
    <div id="navbar" className="flex flex-row">
      <div className="flex flex-col basis-3/5">
        <p className="text-4xl font-semibold mb-6">Rat City Homebrew Club</p>
        <p className="">Homebrewers Club in Seattle</p>
      </div>
      <div className="flex flex-row basis-2/5 text-sm items-center justify-between">
        {links.map((link) => {
          return (
            <Link key={link.name} href={link.href}>{link.name}</Link>
          )
        })}
      </div>
    </div>
  );
}
