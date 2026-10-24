import PageHero from 'core/page-hero';
import Markdown from 'core/markdown';

export const metadata = { title: 'About Us' };

export default function About() {
  return (
    <>
      <PageHero title="About Us" />
      <div className="brew-section">
        <div className="brew-container max-w-3xl">
          <div className="brew-card-flat p-6 md:p-12">
            <div className="brew-rule">
              <span className="brew-label">Who We Are</span>
            </div>
            <Markdown file="about.md" />
          </div>
        </div>
      </div>
    </>
  );
}
