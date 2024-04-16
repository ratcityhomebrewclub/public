import Markdown from 'react-markdown';
// import bylawsPath from '../../bylaws.md';

export default async function Bylaws() {
  // const [test, setTest] = useState();
  // const data = await fetchBylaws();
  // const bylawsPath = '../../bylaws.md';
  // const bylaws = await fetch(bylawsPath).then((response) => response.text()).then((text) => {
  //   setTest(test)
  // });
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section id="bylaws" className="py-12">
        <span>Bylaws will appear here!</span>
        {/* <Markdown source={test} /> */}
      </section>
    </main>
  );
}
