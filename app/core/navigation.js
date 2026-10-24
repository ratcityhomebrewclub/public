'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import links from 'config/navigation';

const primaryLinks = links.filter((l) => l.level === 0);
const childLinks   = (parent) => links.filter((l) => l.level === 1 && l.href.startsWith(parent.href + '/'));

// usePathname() keeps the trailing slash added by `trailingSlash: true`.
const normalize = (p) => (p && p.length > 1 ? p.replace(/\/$/, '') : p);

export default function Navigation() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const pathname = normalize(usePathname());
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navBg = scrolled || !isHome
    ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-xl border-b border-[#2a2a2a]'
    : 'bg-transparent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-brew-amber-glow group-hover:text-yellow-300 transition-colors">
                Rat City
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-brew-muted">
                Homebrew Club
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => {
              const children = childLinks(link);
              const active = pathname === link.href || children.some((c) => c.href === pathname);
              const cls = `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                active
                  ? 'text-brew-amber-glow bg-brew-amber/10'
                  : 'text-stone-300 hover:text-brew-amber-light hover:bg-brew-amber/5'
              }`;

              if (children.length === 0) {
                return <Link key={link.name} href={link.href} className={cls}>{link.name}</Link>;
              }

              return (
                <div key={link.name} className="relative group">
                  <Link href={link.href} className={`${cls} inline-flex items-center gap-1`}>
                    {link.name}
                    <span aria-hidden="true" className="text-[10px] opacity-60">▾</span>
                  </Link>
                  <div className="absolute left-0 top-full pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-150">
                    <div className="min-w-[11rem] rounded-lg border border-brew-border bg-[#141414] shadow-2xl p-1.5">
                      {children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            pathname === child.href
                              ? 'text-brew-amber-glow bg-brew-amber/10'
                              : 'text-stone-300 hover:text-brew-amber-light hover:bg-brew-amber/5'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-stone-300 hover:text-brew-amber-light transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="flex flex-col gap-[5px] w-6">
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-200 ${
                  mobileOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#0f0f0f]/98 border-t border-[#2a2a2a] px-4 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                link.level === 1 ? 'pl-7' : ''
              } ${
                pathname === link.href
                  ? 'text-brew-amber-glow bg-brew-amber/10'
                  : 'text-stone-400 hover:text-brew-amber-light hover:bg-brew-amber/5'
              }`}
            >
              {link.level === 1 && (
                <span className="text-brew-muted text-xs">›</span>
              )}
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
