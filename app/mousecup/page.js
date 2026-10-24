import PageHero from 'core/page-hero';
import Markdown from 'core/markdown';

export const metadata = { title: 'The Mouse Cup' };

export default function MouseCup() {
  return (
    <>
      <PageHero title="The Mouse Cup" />
      <div className="brew-section">
        <div className="brew-container max-w-4xl">
          <div className="brew-card-flat p-6 md:p-12">
            <div className="brew-rule">
              <span className="brew-label">Best In Show</span>
            </div>

            {/* Trophy intro */}
            <div className="flex items-center gap-4 mb-8 p-5 rounded-lg bg-brew-surface border border-brew-border">
              <span className="text-5xl" aria-hidden="true">🐭</span>
              <div>
                <h3 className="mt-0 mb-1 text-brew-amber-glow">The Mouse Cup</h3>
                <p className="text-stone-400 text-sm leading-relaxed m-0">
                  A best-in-show award with a twist: every entry has to meet a
                  shared brewing requirement, announced each year.
                </p>
              </div>
            </div>

            <Markdown file="mousecup.md" />
          </div>
        </div>
      </div>
    </>
  );
}
