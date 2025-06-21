import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

function EditDiary() {
  const { title } = useParams<{ title:string }>();
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (title) {
      invoke<string>("get_diary_content", { title }).then(setContent);
    }
  }, [title]);

  const handleSave = async () => {
    await invoke("update_diary_entry", {
      entry: { title, content },
    });

    navigate(`/read/${encodeURIComponent(title || "")}`);
  };

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold pt-15 pb-5">Edit "{title}"</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-stone-200 text-stone-900 p-5 rounded-xl border-2 border-black w-[60%] text-justify"
      />
      <div className="fixed right-[5%] top-[5%] flex flex-col justify-center items-center gap-3 w-30 ">
        <button onClick={handleSave}>Simpan</button>
        <button onClick={() => navigate(-1)}>Batal</button>
      </div>  
    </main>
  );
}

export default EditDiary;