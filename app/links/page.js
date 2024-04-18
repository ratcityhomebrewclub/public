import Markdown from "@/core/markdown";
import Socials from "core/socials";



export default function Links() {
  return (
    <main className="flex ">
      <section id="about" className="py-12">
        <div className="container mx-auto px-4">
            <Socials />
            <h2 className="mb-6">Useful Links</h2>
            <p>This page contains a number of links to useful resources!</p>
            <Markdown url="/content/links.md" />
        </div>
      </section>
    </main>
  );
}