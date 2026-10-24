import PageHero from 'core/page-hero';
import Markdown from 'core/markdown';

export const metadata = { title: 'Awards' };

export default function Awards() {
  return (
    <>
      <PageHero title="Awards" />
      <div className="brew-section">
        <div className="brew-container max-w-4xl">
          <div className="brew-card-flat p-6 md:p-12">
            <div className="brew-rule">
              <span className="brew-label">Competition Results</span>
            </div>

            {/* Medal legend */}
            <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-lg bg-brew-surface border border-brew-border">
              {[
                { symbol: '🥇', label: 'Gold',   color: 'text-yellow-400' },
                { symbol: '🥈', label: 'Silver', color: 'text-stone-300'  },
                { symbol: '🥉', label: 'Bronze', color: 'text-amber-700'  },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <span className="text-xl">{m.symbol}</span>
                  <span className={`text-sm font-medium ${m.color}`}>{m.label}</span>
                </div>
              ))}
            </div>

            <Markdown file="awards.md" />
          </div>
        </div>
      </div>
    </>
  );
}
