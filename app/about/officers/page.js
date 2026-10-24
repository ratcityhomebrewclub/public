import PageHero from 'core/page-hero';
import Markdown from 'core/markdown';

export const metadata = { title: 'Officers' };

export default function Officers() {
  return (
    <>
      <PageHero title="Officers" label="About" />
      <div className="brew-section">
        <div className="brew-container max-w-2xl">
          <div className="brew-card-flat p-6 md:p-12">
            <div className="brew-rule">
              <span className="brew-label">Leadership</span>
            </div>
            <Markdown file="officers.md" />
          </div>
        </div>
      </div>
    </>
  );
}
