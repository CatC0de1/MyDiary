import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type Props = {
  id: number;
  currentTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newTitle: string) => void;
}

function EditDiaryTitle({ id, currentTitle, isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState(currentTitle);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Judul tidak boleh kosong");
      return;
    }

    try {
      await invoke("update_diary_title", { id, newTitle: title });
      onSuccess?.(title);
      onClose();
    } catch (err) {
      setError("Failed to update title");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-1 z-10">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl text-gray-900 font-semibold mb-4">Ubah Judul "{currentTitle}"</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-gray-900 p-2 border border-gray-300 rounded mb-2"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={onClose}>
            Batal
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSubmit}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDiaryTitle;