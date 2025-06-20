import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

function ReadDiary() {
  const { title } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (title) {
      invoke<string>("get_diary_content", { title }).then(setContent)
    }
  }, [title]);

  return (
    <main className="container">
      <h1>{title}</h1>
      <pre>{content}</pre>
      <Link to="/" className="button">Kembali</Link>
    </main>
  );
}

export default ReadDiary;