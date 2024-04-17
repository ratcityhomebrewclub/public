import Markdown from "@/markdown";

export default function About() {
  return (
    <main className="flex flex-col">
      <section id="about" className="py-12">
        <div className="container mx-auto">
          <Markdown url="/content/about.md" />
        </div>
      </section>
    </main>
  );
}
