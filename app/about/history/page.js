import PageHero from 'core/page-hero';
import Markdown from 'core/markdown';

export const metadata = { title: 'Club History' };

export default function History() {
  return (
    <>
      <PageHero title="Club History" label="About" />
      <div className="brew-section">
        <div className="brew-container max-w-3xl">
          <div className="brew-card-flat p-6 md:p-12">
            <Markdown file="history.md" />
          </div>
        </div>
      </div>
    </>
  );
}
