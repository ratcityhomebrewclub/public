import Link from 'next/link';
import Image from 'next/image';
import socials from 'config/socials.js';
import links from 'config/navigation';
import { withBase } from './paths';

const navLinks = links.filter((l) => l.href !== '/');

const sponsors = [
  {
    name: 'WAHA',
    img:  '/images/waha.png',
    url:  'https://www.wahomebrewers.org/',
    white: false,
  },
  {
    name: 'Sound Homebrew Supply',
    img:  '/images/shs.png',
    url:  'https://soundhomebrew.com/',
    white: true,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand + socials */}
          <div>
            <h3 className="font-display text-2xl font-bold text-brew-amber-glow mb-3 mt-0">
              Rat City<br />Homebrew Club
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-6">
              Seattle&apos;s community of passionate homebrewers — crafting,
              sharing, and celebrating great beer since our founding.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-9 h-9 rounded-full bg-brew-card border border-brew-border flex items-center justify-center hover:border-brew-amber/50 hover:bg-[#2a2a2a] transition-all"
                >
                  <Image
                    src={withBase(s.img)}
                    alt={s.name}
                    width={18}
                    height={18}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="brew-label mb-5">Navigation</p>
            <ul className="space-y-2.5 list-none ml-0">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-stone-500 hover:text-brew-amber-light text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sponsors */}
          <div>
            <p className="brew-label mb-5">Partners &amp; Sponsors</p>
            <div className="flex flex-col gap-4">
              {sponsors.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block opacity-60 hover:opacity-100 transition-opacity"
                  title={item.name}
                >
                  <div className={`inline-flex items-center rounded-lg p-2 ${item.white ? 'bg-white' : ''}`}>
                    <Image
                      src={withBase(item.img)}
                      alt={item.name}
                      width={150}
                      height={60}
                      className="object-contain max-h-12"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2a2a2a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-700 text-sm">
            © {new Date().getFullYear()} Rat City Homebrew Club · Seattle, WA
          </p>
          <div className="flex items-center gap-4">
            <p className="text-stone-700 text-xs italic">We like beer.</p>
            <Link href="/admin" className="text-stone-800 hover:text-stone-500 text-xs">Admin</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
