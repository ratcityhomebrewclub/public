import PageHero from 'core/page-hero';
import Markdown from 'core/markdown';
import Socials from 'core/socials';

export const metadata = { title: 'Useful Links' };

export default function Links() {
  return (
    <>
      <PageHero title="Useful Links" />
      <div className="brew-section">
        <div className="brew-container max-w-3xl">

          {/* Socials */}
          <div className="brew-card-flat p-8 mb-6">
            <Socials />
          </div>

          {/* Links from markdown */}
          <div className="brew-card-flat p-6 md:p-10">
            <div className="brew-rule">
              <span className="brew-label">Useful Resources</span>
            </div>
            <p className="text-stone-400 text-sm mb-6">
              A curated collection of homebrewing resources, tools, and communities.
            </p>
            <Markdown file="links.md" />
          </div>

        </div>
      </div>
    </>
  );
}
