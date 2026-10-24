import PageHero from 'core/page-hero';

export const metadata = { title: 'Calculators' };

export default function Calculators() {
  return (
    <>
      <PageHero title="Calculators" />
      <div className="brew-section">
        <div className="brew-container max-w-3xl">
          <div className="brew-card-flat p-6 md:p-12">
            <p>Brewing calculators are coming soon!</p>
          </div>
        </div>
      </div>
    </>
  );
}
