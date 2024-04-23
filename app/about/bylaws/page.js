'use client'
import Markdown from "core/markdown";
import Link from "next/link";
// import bylawsPath from '../../bylaws.md';

export default function Bylaws() {
  const docStyle = {
    // width: "",
    // height: "auto",
    // display: "block"

  }

  return (
    <div className="flex flex-col ">
      <Link href="https://docs.google.com/document/d/1CE2W-2DxxtAYjgo1ekNAxeetMH5Lh5jOGSfVQWza5Rs/edit?usp=sharing">View in Google Docs</Link>
      <iframe src="https://docs.google.com/document/d/e/2PACX-1vR7183FUdSVVw3anhEJlSmYbjjzYwtYXhk7bt04RpVnG-WdI876cEPto0XiVpntdygdRlTdcje-g6T1/pub?embedded=true" style={docStyle} className="grow max-w-full w-auto"></iframe>
    </div>
  );
}
