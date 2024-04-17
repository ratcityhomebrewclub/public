'use client'
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";

export default function Markdown(props) {

  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(props.url)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [props.url]);

  return (
    <div className="markdown">
        <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
