import SideBar from "./sidebar";

export default function Home() {
  return (
    <div className="flex flex-row items-center justify-between">
      <div id="about" className="flex-row basis-4/5 py-12">
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6">About Us</h2>
            <p>Welcome to the Rat City Homebrew Club! We are a community of beer enthusiasts who love to brew our own beer.</p>
            <p>Join us to learn, share, and enjoy the wonderful world of homebrewing.</p>
        </div>
        <div id="events" className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6">Upcoming Events</h2>
            <p>Stay tuned for our upcoming events and activities!</p>
        </div>
      </div>
      <div className="basis-1/5">
        <SideBar />
      </div>
    </div>
  );
}
