import Markdown from "@/core/markdown";

export default function Links() {
  return (
    <main className="flex ">
      <section id="history" className="py-12">
        <div className="container mx-auto px-4">
          <Markdown url="/content/history.md" />
        </div>
      </section>
    </main>
  );
}