import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

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
    <main className="container">
      <h1>Tulis Bab Baru</h1>
      <input
        type="text"
        placeholder="Judul Bab"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <textarea
        placeholder="Isi diary ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea"
      />
      <button onClick={handleSubmit} className="button">Simpan</button>
      <Link to="/" className="button">Kembali</Link>
    </main>
  );
}

export default WriteDiary;