import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Title from "../components/Title";
import "../styles/ReadDiary.css"

function ReadDiary() {
  const { id } = useParams();
  const diaryId = parseInt(id || "", 10);
  const [diary, setDiary] = useState<{ title: string, content: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNaN(diaryId)) {
      invoke<{ title: string; content: string }>("get_diary_content", { id:diaryId })
        .then(setDiary)
    }
  }, [diaryId]);

  const handleDelete = async () => {
    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus "${diary?.title}"?`);
    if (!confirmDelete) return;

    await invoke("delete_diary_entry", { id:diaryId });
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/edit/${diaryId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <Title />
      <h1 className="text-2xl font-bold pt-15 pb-5">
        {diary?.title ?? "Memuat . . ."}
      </h1>
      <p className="bg-stone-200 text-stone-900 p-5 rounded-xl border-2 border-black w-[60%] text-justify">
        {diary?.content ?? "Memuat konten . . ."}
      </p>

      <div className="fixed right-[5%] top-[5%] flex flex-col justify-center items-center gap-3 w-30">
        <button onClick={handleEdit} className="button bg-yellow-400 hover:bg-yellow-500">Edit</button>
        <button onClick={handleDelete} className="button bg-red-600 hover:bg-red-700">Delete</button>
      </div>
    </main>
  );
}

export default ReadDiary;