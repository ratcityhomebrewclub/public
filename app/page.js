import About from "./about/page";
import SideBar from "./core/sidebar";

export default function Home() {
  return (
    <div className="flex flex-wrap justify-center align-top px-20">
      <div id="about" className="flex-row py-2 lg:basis-3/5">
        <About />
      </div>
      <SideBar />
    </div>
  );
}
