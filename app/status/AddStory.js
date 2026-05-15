"use client";

import { useState } from "react";

export default function AddStory({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleUpload = async () => {
    if (!file && !text) {
      alert("Select file or write text");
      return;
    }

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    if (text) {
      formData.append("text", text);
      formData.append("type", "TEXT");
    } else if (file) {
      const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
      formData.append("type", type);
    }

    try {
      const res = await fetch("https://final-repository-3.onrender.com/status/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onUpload && onUpload(); // refresh status
        onClose();
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-xl"
      >
        ✕
      </button>

      {/* FILE INPUT */}
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 text-white"
      />

      {/* TEXT INPUT */}
      <input
        type="text"
        placeholder="Write a status..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 rounded mb-4 w-64"
      />

      {/* PREVIEW */}
      {file && (
        <div className="mb-4">
          {file.type.startsWith("image") ? (
            <img
              src={URL.createObjectURL(file)}
              className="max-h-60"
            />
          ) : (
            <video
              src={URL.createObjectURL(file)}
              className="max-h-60"
              controls
            />
          )}
        </div>
      )}

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-6 py-2 rounded"
      >
        Upload Status
      </button>
    </div>
  );
}
