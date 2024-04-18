import Socials from "./socials";
const calendarStyle = {
  border: "solid 1px #777",
  width: "auto",
  height: "300px",
  frameborder: "0",
  scrolling: "no"
}


export default function SideBar() { 
  return (
    <div id="sidebar" className="flex flex-col lg:basis-1/5">
      <Socials />
      <div id="meetings" className="py-4">
          <div className="container mx-auto">
              <h2 className="mb-6">Meetings</h2>
              <p>Monthly Club Meetings are usually held on the 3rd Thursday of the month at 6:30pm at Sound Homebrew Supply in Seattle.</p>
          </div>
      </div>
      <div id="nextevent" className="py-4">
          <div className="container mx-auto">
              <h2 className="mb-6">Upcoming Events</h2>
              <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&mode=AGENDA&src=cmF0Y2l0eWhvbWVicmV3ZXJzQGdtYWlsLmNvbQ&color=%23D50000" style={calendarStyle}></iframe>
          </div>
      </div>
    </div>
  );
}
