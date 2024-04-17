
export default function Calendar() {
  const mapStyle = {
    border: 0,
    width: 800,
    height: 600,
    frameborder: 0,
    scrolling: "no"
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section id="calendar" className="py-12">
        <iframe src="https://calendar.google.com/calendar/embed?src=ratcityhomebrewers%40gmail.com&ctz=America%2FLos_Angeles" style={mapStyle}></iframe>
      </section>
    </main>
  );
}