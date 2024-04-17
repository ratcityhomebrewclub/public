import About from "./about/page";
import SideBar from "./sidebar";

export default function Home() {
  return (
    <div className="flex flex-row justify-center align-top px-20">
      <div id="about" className="flex-row py-2 basis-3/5">
        <About />
        <div id="events" className="container mx-auto pb-10">
            <h2 className="mb-6">Upcoming Events</h2>
            <p>Stay tuned for our upcoming events and activities!</p>
        </div>
      </div>
      <SideBar />
    </div>
  );
}
