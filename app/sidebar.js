
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from 'next/link';

import "./globals.css";
import Socials from "./socials";



export default function SideBar() { 
  return (
    <div id="sidebar" className="flex flex-col py-12">
      <Socials />
      <div id="meetings" className="py-4">
          <div className="container mx-auto">
              <h2 className="text-3xl font-semibold mb-6">Meetings</h2>
              <p>Monthly Club Meetings are usually held on the 3rd Thursday of the month at 6:30pm at Sound Homebrew Supply in Seattle.</p>
          </div>
      </div>
      <div id="nextevent" className="py-4">
          <div className="container mx-auto">
              <h2 className="text-3xl font-semibold mb-6">Next Event</h2>
              <p>Stay tuned for our upcoming meetings!</p>
          </div>
      </div>
    </div>
  );
}
