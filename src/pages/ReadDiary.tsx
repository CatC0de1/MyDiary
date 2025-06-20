import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

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
    <main className="container">
      <h1>{title}</h1>
      <p>{content}</p>

      <div>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
        <Link to="/" className="button">Kembali</Link>
      </div>
    </main>
  );
}

export default ReadDiary;