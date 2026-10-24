import PageHero from 'core/page-hero';
import Markdown from 'core/markdown';

export const metadata = { title: 'The Rat Cup' };

export default function RatCup() {
  return (
    <>
      <PageHero title="The Rat Cup" />
      <div className="brew-section">
        <div className="brew-container max-w-4xl">
          <div className="brew-card-flat p-6 md:p-12">
            <div className="brew-rule">
              <span className="brew-label">Best In Show</span>
            </div>

            {/* Trophy intro */}
            <div className="flex items-center gap-4 mb-8 p-5 rounded-lg bg-brew-surface border border-brew-border">
              <span className="text-5xl" aria-hidden="true">🏆</span>
              <div>
                <h3 className="mt-0 mb-1 text-brew-amber-glow">The Rat Cup</h3>
                <p className="text-stone-400 text-sm leading-relaxed m-0">
                  Our best-in-show trophy, voted on by attendees at the annual
                  end-of-year potluck. A true mark of the club&apos;s highest honour.
                </p>
              </div>
            </div>

            <Markdown file="ratcup.md" />
          </div>
        </div>
      </div>
    </>
  );
}
