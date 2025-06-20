import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

function Home() {
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    invoke<string[]>("get_diary_titles").then(setTitles);
  }, []);

  return (
    <main className="container">
      <h1>Home</h1>
      <ul>
        {titles.map((title) => (
          <li key={title}>
            <Link to={`/page/${encodeURIComponent(title)}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Home;