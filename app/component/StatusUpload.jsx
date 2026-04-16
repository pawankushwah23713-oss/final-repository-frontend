"use client";

import { useState } from "react";

export default function StatusUpload({ refresh }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    let imageUrl = "";

    // 👇 file ko public/uploads me store (temporary frontend approach)
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      imageUrl = data.url;
    }

    await fetch("http://localhost:8080/status/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "user1",
        text: text,
        imageUrl: imageUrl,
      }),
    });

    setText("");
    setFile(null);
    refresh(); // reload statuses
  };

  return (
    <div className="p-4 border rounded-xl mb-4">
      <input
        type="text"
        placeholder="Write status..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />

      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Upload Status
      </button>
    </div>
  );
}