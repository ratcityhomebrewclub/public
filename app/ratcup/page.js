import Markdown from "@/core/markdown";

export default function Awards() {
  return (
    <main className="flex ">
      <section id="ratcup" className="py-12">
        <div className="container mx-auto px-4">
          <Markdown url="/content/ratcup.md" />
        </div>
      </section>
    </main>
  );
}