import Link from "next/link";

export default function Contact() {
  const mapStyle = {
    width: "80%",
    height: "600px",
    border: 0,
    allowfullscreen: "" 
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section id="contact" className="">
        <div className="dues mb-20">
          <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
          <Link href="mailto:ratcityhomebrewers@gmail.com">Email Us</Link>
        </div>
        
        <div className="flex flex-col items-center justify-between">
          <h3 className="text-2xl font-semibold mb-6">Meetings</h3>
          <p>We meet the 3rd Thursday, 6:30PM at Sound Homebrew in Georgetown/SODO.</p>
          <p>6505 5th Place S, Seattle, WA 98108</p>
          
          <h3 className="text-2xl font-semibold mt-6">There are some exceptions:</h3>
          <p>In July & August we sometimes have “social meetings” instead of a formal club meeting.</p>
          <p>In December we have a holiday party. Usually at a local brewery.</p>
          <p>And you can often find us around town, you guessed it, enjoying beer at local breweries.</p>
          <p>For club meetings please bring your own tasting glass (noone likes to drink out of plastic!) and of course your delicious homebrew for sampling!</p>
        </div>

        <div className="flex flex-col items-center justify-between mt-5">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5386.293266408721!2d-122.3302345231486!3d47.545474792195805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549041944180fc31%3A0x3fde0dc411a3228a!2sSound%20Homebrew%20Supply!5e0!3m2!1sen!2sus!4v1713313876082!5m2!1sen!2sus" style={mapStyle} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>
    </main>
  );
}