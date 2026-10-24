import PageHero from 'core/page-hero';
export const metadata = { title: 'Calendar' };

export default function Calendar() {
  return (
    <>
      <PageHero title="Calendar" />
      <div className="brew-section">
        <div className="brew-container max-w-5xl">
          <div className="brew-card-flat p-4 md:p-8">
            <div className="brew-rule">
              <span className="brew-label">Club Events</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-brew-border">
              <iframe
                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&src=cmF0Y2l0eWhvbWVicmV3ZXJzQGdtYWlsLmNvbQ&color=%23D50000"
                className="w-full"
                style={{ height: '620px', border: 0 }}
                scrolling="no"
                title="Rat City Homebrew Club Calendar"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
