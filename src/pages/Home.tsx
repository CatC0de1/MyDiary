import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import FormattedDate from "../components/FormattedDate";
import DynamicTitle from "../components/DynamicTitle";

type DiaryTitle = {
  id: number;
  title: string;
  created_at: string;
  last_updated: string;
};

function Home() {
  const [titles, setTitles] = useState<DiaryTitle[]>([]);

  useEffect(() => {
    invoke<DiaryTitle[]>("get_diary_titles").then(setTitles);
  }, []);

  return (
    <main className="flex justify-center items-center flex-col">
      <DynamicTitle title={null} />
      <h1 className="my-[5%] text-4xl">MyDiary</h1>
      <ul className="flex flex-col items-center justify-center w-[85%]">

        { titles === null ? ( 
          <p className="text-gray-500">Memuat . . .</p>
        ) : (
          titles.map((entry) => (
            <li key={entry.title} className="w-full max-w-lg mb-4">
              <Link to={`/read/${entry.id}`}>
                <div className="flex flex-col bg-gray-600 rounded-lg shadow-lg w-full p-4 hover:bg-gray-700 transition-colors">
                  <h2 className="text-xl font-bold">
                    {entry.title}
                  </h2>
                  <div className="self-end flex flex-col gap-2 text-sm text-gray-300">
                    <div className="flex flex-row justify-between gap-2">
                      <p className="">Created at:</p>
                      <p className="">
                        <FormattedDate isoString={entry.created_at} timeZone="Asia/Tokyo" />
                      </p>
                    </div>
                    <div className="flex flex-row justify-between gap-2">
                      <p className="">Last updated:</p>
                      <p className="">
                        <FormattedDate isoString={entry.last_updated} timeZone="Asia/Tokyo" />
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
  
      </ul>
      <Link to="/write" className="bg-zinc-600 p-2 rounded-lg hover:bg-zinc-700">+ Tulis Bab Baru</Link>
    </main>
  );
}

export default Home;