import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

function DinamycDiary() {
  const { title } = useParams<{ title: string }>();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (title) {
      invoke<string>("get_diary_content", { title })
        .then(setContent)
    }
  }, [title]);

  return (
    <main className="container">
      <h1>{title}</h1>
      <p>{content}</p>
      <Link to="/">Back to Home</Link>
    </main>
      
  );
}

export default DinamycDiary;