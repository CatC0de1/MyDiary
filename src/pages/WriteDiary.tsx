import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Title from "../components/Title";
import DynamicTitle from "../components/DynamicTitle";

function WriteDiary() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) return alert("Title and content cannot be empty");
  
    try {
      await invoke("add_diary_entry", { entry: { title, content} });
      navigate("/");
    } catch (error) {
      console.error("Failed to save diary entry:", error);
      alert("Failed to save diary entry. Please try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-4 gap-4">
      <DynamicTitle title={"New Diary"} />
      <Title />
      <h1 className="text-2xl font-bold pt-15 pb-5">Tulis Bab Baru</h1>
      <input
        type="text"
        placeholder="Judul Bab"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-stone-200 text-stone-900 px-5 py-3 rounded-xl border-2 border-black w-[60%] text-justify"
      />
      <textarea
        placeholder="Isi diary ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-stone-200 text-stone-900 p-5 rounded-xl border-2 border-black w-[60%] text-justify"
      />
      <button onClick={handleSubmit} className="self-end mr-[20%] px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors rounded-lg">Simpan</button>
    </main>
  );
}

export default WriteDiary;