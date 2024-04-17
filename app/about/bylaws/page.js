'use client'
import Markdown from "core/markdown";
// import bylawsPath from '../../bylaws.md';

export default function Bylaws() {
  const docStyle = {
    width: "800px",
    height: "auto",
    display: "block"

  }

  return (
    <div className="flex">
      <iframe src="https://docs.google.com/document/d/e/2PACX-1vR7183FUdSVVw3anhEJlSmYbjjzYwtYXhk7bt04RpVnG-WdI876cEPto0XiVpntdygdRlTdcje-g6T1/pub?embedded=true" style={docStyle} ></iframe>
    </div>
  );
}
