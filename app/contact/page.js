import PageHero from 'core/page-hero';
import Link from 'next/link';

export const metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <>
      <PageHero title="Contact" />
      <div className="brew-section">
        <div className="brew-container max-w-4xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Email card */}
            <div className="brew-card-flat p-8">
              <div className="brew-rule">
                <span className="brew-label">Say Hello</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Questions about the club? Want to visit a meeting before joining?
                We&apos;d love to hear from you.
              </p>
              <Link
                href="mailto:ratcityhomebrewers@gmail.com"
                className="brew-btn text-sm"
              >
                Email Us
              </Link>
            </div>

            {/* Meetings card */}
            <div className="brew-card-flat p-8">
              <div className="brew-rule">
                <span className="brew-label">Meetings</span>
              </div>
              <div className="space-y-4 text-stone-400 text-sm leading-relaxed">
                <p>
                  The first week of the month we hold a happy hour at a local
                  brewery — check the calendar for date &amp; location.
                </p>
                <p>
                  Official meetings are the{' '}
                  <strong className="text-stone-200">
                    3rd Thursday of every month, 6:30&nbsp;PM
                  </strong>{' '}
                  at Future Primitive Brewing in White Center.
                </p>
                <p className="text-brew-amber-light font-medium">
                  9832 14th Ave SW, Seattle, WA 98106
                </p>
                <div className="border-t border-brew-border pt-4">
                  <p className="text-stone-500 font-medium mb-2">Exceptions</p>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li>July &amp; August — sometimes social meetings</li>
                    <li>December — holiday party at a local brewery</li>
                  </ul>
                </div>
                <p className="text-stone-600 text-xs">
                  Bring your own tasting glass and your homebrew to share!
                </p>
              </div>
            </div>

          </div>

          {/* Map */}
          <div className="brew-card-flat overflow-hidden p-4">
            <iframe
              src="https://maps.google.com/maps?q=Future%20Primitive%20Brewing%2C%209832%2014th%20Ave%20SW%2C%20Seattle%2C%20WA%2098106&z=15&output=embed"
              className="w-full rounded-lg"
              style={{ height: '400px', border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Future Primitive Brewing"
            />
          </div>

        </div>
      </div>
    </>
  );
}
