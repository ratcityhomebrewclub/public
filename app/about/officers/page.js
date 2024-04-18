import Markdown from "@/core/markdown";

export default function About() {
  return (
    <main className="flex ">
      <section id="officers" className="py-12">
       <div className="container mx-auto px-4">
          <Markdown url="/content/officers.md" />
        </div>
      </section>
    </main>
  );
}
