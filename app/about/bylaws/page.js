'use client'
import Markdown from "@/markdown";
// import bylawsPath from '../../bylaws.md';

export default function Bylaws() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section id="bylaws" className="py-12">
        <span>Bylaws will appear here!</span>
        <Markdown url="/bylaws/bylaws.md" />
      </section>
    </main>
  );
}
