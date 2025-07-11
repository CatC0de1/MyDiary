import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

import DynamicTitle from "../components/DynamicTitle";

function EditDiaryContent() {
  const { id } = useParams();
  const diaryId = parseInt(id || "", 10);
  const [diary, setDiary] = useState<{ title: string, content: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNaN(diaryId)) {
      invoke<{ title: string; content: string }>("get_diary_content", { id: diaryId })
        .then(setDiary);
    }
  }, [diaryId]);

  const handleSave = async () => {
    if (!diary) return;
    await invoke("update_diary_content", {
      entry: { 
        id: diaryId,
        title: diary.title,
        content: diary.content,
      },
    });

    navigate(`/read/${diaryId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <DynamicTitle title={diary?.title} />
      <h1 className="text-2xl font-bold pt-15 pb-5">Edit "{diary?.title}"</h1>
      <textarea
        value={diary?.content || ""}
        onChange={(e) => 
          setDiary((prev) => prev ? { ...prev, content: e.target.value} : null)
        }
        className="bg-stone-200 text-stone-900 p-5 rounded-xl border-2 border-black w-[60%] text-justify"
      />
      <div className="fixed right-[5%] top-[5%] flex flex-col justify-center items-center gap-3 w-30 ">
        <button onClick={handleSave} className="button bg-green-400 hover:bg-green-500">
          Simpan
        </button>
        <button onClick={() => navigate(-1)} className="button bg-red-400 hover:bg-red-500">
          Batal
        </button>
      </div>  
    </main>
  );
}

export default EditDiaryContent;