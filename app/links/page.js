import Socials from "core/socials";
import Image from "next/image";
import Link from 'next/link';



export default function Links() {
  return (
    <main className="flex ">
      <section id="about" className="py-12">
        <div className="container mx-auto px-4">
            <Socials />
            <h2 className="mb-6">Useful Links</h2>
            <p>This page contains a number of links to useful resources!</p>
          {/*

          Seattle water: https://www.seattle.gov/utilities/your-services/water/water-quality/analyses 
          BJCP Guidelines: https://www.bjcp.org/bjcp-style-guidelines/
          
          */}
        </div>
      </section>
    </main>
  );
}