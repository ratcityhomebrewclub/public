import Link from 'next/link';
import PageHero from 'core/page-hero';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <>
      <PageHero title="Page Not Found" label="404" />
      <div className="brew-section">
        <div className="brew-container max-w-xl text-center">
          <p className="text-stone-400 mb-8">
            That page seems to have been drunk already. Try heading back home.
          </p>
          <Link href="/" className="brew-btn">Back to Home</Link>
        </div>
      </div>
    </>
  );
}
