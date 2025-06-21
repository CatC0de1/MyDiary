import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Title from "../components/Title";
import "../styles/ReadDiary.css"

function ReadDiary() {
  const { title } = useParams();
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (title) {
      invoke<string>("get_diary_content", { title }).then(setContent)
    }
  }, [title]);

  const handleDelete = async () => {
    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus "${title}"?`);
    if (!confirmDelete) return;

    await invoke("delete_diary_entry", { title });
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/edit/${encodeURIComponent(title || "")}`);
  };

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <Title />
      <h1 className="text-2xl font-bold pt-15 pb-5">{title}</h1>
      <p className="bg-stone-200 text-stone-900 p-5 rounded-xl border-2 border-black w-[60%] text-justify">{content}</p>

      <div className="fixed right-[5%] top-[5%] flex flex-col justify-center items-center gap-3 w-30">
        <button onClick={handleEdit} className="button bg-yellow-400 hover:bg-yellow-500">Edit</button>
        <button onClick={handleDelete} className="button bg-red-600 hover:bg-red-700">Delete</button>
      </div>
    </main>
  );
}

export default ReadDiary;