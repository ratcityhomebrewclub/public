'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { withBase } from './paths';

export default function HeroBanner() {
  const bgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.45}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-24 -bottom-24 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${withBase('/images/header-ai-4x.jpeg')}')` }}
      />

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0f0f0f]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-20">
          <div className="max-w-3xl">
            {/* Label */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="brew-badge mb-6 inline-block">
                Seattle&apos;s Homebrew Community
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 drop-shadow-2xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              Rat City<br />
              <span className="text-white/90">Homebrew</span><br />
              <span className="text-brew-amber">Club</span>
            </h1>

            {/* Tagline */}
            <p
              className="text-lg md:text-xl text-stone-300 mb-10 leading-relaxed max-w-xl animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            >
              A passionate community of brewers in Seattle — crafting, sharing,
              and celebrating great beer together.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4 animate-fade-up"
              style={{ animationDelay: '0.55s' }}
            >
              <Link href="/membership" className="brew-btn text-base">
                Join the Club
              </Link>
              <Link href="/calendar" className="brew-btn-outline text-base">
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-pulse-slow">
        <span className="text-stone-600 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-stone-600 to-transparent" />
      </div>
    </div>
  );
}
