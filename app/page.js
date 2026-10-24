import Markdown from './core/markdown';
import SideBar from './core/sidebar';
import Link from 'next/link';
import HeroBanner from './core/banner';

const quickLinks = [
  {
    label: 'Upcoming Events',
    href:  '/calendar',
    emoji: '📅',
    desc:  'See what\u2019s brewing this month',
  },
  {
    label: 'Join the Club',
    href:  '/membership',
    emoji: '🍺',
    desc:  '$25/year membership',
  },
  {
    label: 'Competition Awards',
    href:  '/awards',
    emoji: '🏅',
    desc:  'Our medal-winning brews',
  },
  {
    label: 'The Rat Cup',
    href:  '/ratcup',
    emoji: '🏆',
    desc:  'Best-in-show trophy',
  },
];

export default function Home() {
  return (
    <div>
      <HeroBanner />

      {/* Main content row */}
      <section className="brew-section">
        <div className="brew-container">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: About + quick links */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* About card */}
              <div className="brew-card-flat p-6 md:p-10">
                <div className="brew-rule">
                  <span className="brew-label">About Us</span>
                </div>
                <Markdown file="about.md" />
              </div>

              {/* Quick-link cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="brew-card p-5 flex flex-col gap-2 no-underline group"
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="font-semibold text-brew-amber-light text-sm group-hover:text-brew-amber-glow transition-colors">
                      {item.label}
                    </span>
                    <span className="text-stone-500 text-xs leading-snug">
                      {item.desc}
                    </span>
                  </Link>
                ))}
              </div>

            </div>

            {/* Right: Sidebar */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
              <SideBar />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
