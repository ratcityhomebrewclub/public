import Image from "next/image";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section id="about" className="py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-6">About Us</h2>
            <p>This page is all about the club!</p>
        </div>
      </section>
    </main>
  );
}
