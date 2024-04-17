
export default function Calendar() {
  const mapStyle = {
    border: 0,
    width: 800,
    height: 600,
    frameborder: 0,
    scrolling: "no"
  }
  return (
    <main className="flex">
      <section id="calendar" className="py-12">
        <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&src=cmF0Y2l0eWhvbWVicmV3ZXJzQGdtYWlsLmNvbQ&color=%23D50000" style={mapStyle}></iframe>
      </section>
    </main>
  );
}