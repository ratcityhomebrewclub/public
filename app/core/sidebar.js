import Socials from './socials';

export default function SideBar() {
  return (
    <div className="brew-card-flat flex flex-col gap-6 p-6 lg:sticky lg:top-24 self-start">

      {/* Social links */}
      <Socials />

      {/* Divider */}
      <div className="border-t border-brew-border" />

      {/* Meetings */}
      <div>
        <p className="brew-label mb-3">Meetings</p>
        <p className="text-stone-400 text-sm leading-relaxed">
          Monthly meetings are held on the{' '}
          <strong className="text-stone-200">3rd Thursday of the month</strong>{' '}
          at 6:30&nbsp;pm at Future Primitive Brewing in White Center.
        </p>
        <p className="text-stone-500 text-xs mt-2">
          Bring a tasting glass and your homebrew!
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-brew-border" />

      {/* Calendar */}
      <div>
        <p className="brew-label mb-3">Upcoming Events</p>
        <div className="rounded-lg overflow-hidden border border-brew-border">
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&mode=AGENDA&src=cmF0Y2l0eWhvbWVicmV3ZXJzQGdtYWlsLmNvbQ&color=%23D50000"
            className="w-full"
            style={{ height: 280, border: 0 }}
            scrolling="no"
            title="Club Calendar"
          />
        </div>
      </div>

    </div>
  );
}
