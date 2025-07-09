import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import "../styles/Home.css";

type DiaryTitle = {
  id: number;
  title: string;
  created_at: string;
};

function Home() {
  const [titles, setTitles] = useState<DiaryTitle[]>([]);

  useEffect(() => {
    invoke<DiaryTitle[]>("get_diary_titles").then(setTitles);
  }, []);

  return (
    <main className="flex justify-center items-center flex-col">
      <h1 className="my-[5%] text-4xl">MyDiary</h1>
      <ul className="flex flex-col items-center justify-center w-[85%]">
        {titles.map((entry) => (
          <li key={entry.title} className="w-full max-w-lg mb-4">
            <Link to={`/read/${entry.id}`}>
              <div className="flex flex-col bg-gray-600 rounded-lg shadow-lg w-full p-4 hover:bg-gray-700 transition-colors">
                <h2 className="text-xl font-bold">
                  {entry.title}
                </h2>
                <h2 className="text-sm text-gray-300 self-end">
                  {new Date(entry.created_at).toLocaleDateString()}
                </h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/write" className="bg-zinc-600 p-2 rounded-lg hover:bg-zinc-700">+ Tulis Bab Baru</Link>
    </main>
  );
}

export default Home;