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
    <main className="container">
      <h1>Edit: {title}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div>
        <button onClick={handleSave}>Simpan</button>
        <button onClick={() => navigate(-1)}>Batal</button>
      </div>  
    </main>
  );
}

export default EditDiary;