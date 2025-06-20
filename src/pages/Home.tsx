import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import "../styles/Home.css";

type DiaryTitle = {
  title: string;
  created_at: string;
};

function Home() {
  const [titles, setTitles] = useState<DiaryTitle[]>([]);

  useEffect(() => {
    invoke<DiaryTitle[]>("get_diary_titles").then(setTitles);
  }, []);

  return (
    <main className="container">
      <h1>MyDiary</h1>
      <Link to="/write" className="button">+ Tulis Bab Baru</Link>
      <ul>
        {titles.map((entry) => (
          <li key={entry.title}>
            <Link to={`/read/${encodeURIComponent(entry.title)}`}>
              {entry.title} = {new Date(entry.created_at).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Home;