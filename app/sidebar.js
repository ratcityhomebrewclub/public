
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from 'next/link';

import "./globals.css";




export default function SideBar() { 
  return (
    <div id="sidebar" className="flex flex-col">
      <div id="meetings" className="py-12">
          <div className="container mx-auto">
              <h2 className="text-3xl font-semibold mb-6">Upcoming Meetings</h2>
              <p>Stay tuned for our upcoming meetings!</p>
          </div>
      </div>
      <div id="Socials" className="py-12">
          <div className="container mx-auto">
              <h2 className="text-3xl font-semibold mb-6">Next Event</h2>
              <p>Stay tuned for our upcoming meetings!</p>
          </div>
      </div>
      <div id="nextevent" className="py-12">
          <div className="container mx-auto">
              <h2 className="text-3xl font-semibold mb-6">Next Event</h2>
              <p>Stay tuned for our upcoming meetings!</p>
          </div>
      </div>
    </div>
  );
}
