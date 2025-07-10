import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Title from "../components/Title";
import EditDiaryTitle from "../components/EditDiaryTitle";
import FormattedDate from "../components/FormattedDate";
import "../styles/ReadDiary.css"

type DiaryDetail = {
  title: string;
  content: string;
  created_at: string;
  last_updated: string;
}

function ReadDiary() {
  const { id } = useParams();
  const diaryId = parseInt(id || "", 10);
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNaN(diaryId)) {
      invoke<DiaryDetail>("get_diary_content", { id:diaryId })
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
      <h1 className="text-2xl font-bold pt-15 pb-3">
        {diary?.title ?? "Memuat . . ."}
      </h1>
      <span className="flex flex-col gap-1 pb-5 text-sm">
        <h2>Created at : <FormattedDate isoString={diary?.created_at ?? ""} timeZone="Asia/Tokyo" /></h2>
        <h2>Last Updated : <FormattedDate isoString={diary?.last_updated ?? ""} timeZone="Asia/Tokyo" /></h2>
      </span>
      <p className="bg-stone-200 text-stone-900 p-5 rounded-xl border-2 border-black w-[60%] text-justify">
        {diary?.content ?? "Memuat konten . . ."}
      </p>

      <div className="fixed right-[5%] top-[5%] flex flex-col justify-center items-center gap-3 w-30">
        <button onClick={handleEdit} className="button bg-yellow-400 hover:bg-yellow-500">Edit Content</button>
        <button onClick={() => setIsModalOpen(true)} className="button bg-yellow-400 hover:bg-yellow-500">Edit Title</button>
        <button onClick={handleDelete} className="button bg-red-600 hover:bg-red-700">Delete</button>
      </div>

      <EditDiaryTitle
        id={diaryId}
        currentTitle={diary?.title || ""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newTitle) => setDiary((prev) => prev && { ...prev, title: newTitle })}
      />
    </main>
  );
}

export default ReadDiary;