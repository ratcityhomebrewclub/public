import Image from 'next/image';
import { withBase } from './paths';
import socials from 'config/socials.js';

export default function Socials() {
  return (
    <div>
      <p className="brew-label mb-4">Connect With Us</p>
      <div className="flex flex-wrap gap-2">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            className="w-10 h-10 rounded-full bg-[#252525] border border-brew-border flex items-center justify-center hover:border-brew-amber/50 hover:bg-[#2e2e2e] transition-all"
          >
            <Image
              src={withBase(social.img)}
              alt={social.name}
              width={20}
              height={20}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
