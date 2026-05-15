"use client";
import { useState } from "react";

export default function StatusUpload({ refresh }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const upload = async () => {
    let contentUrl = "";
    let type = "TEXT";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://final-repository-3.onrender.com/file/upload", {
        method: "POST",
        body: formData,
      });

      contentUrl = await res.text();
      type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
    }

    await fetch("https://final-repository-production.up.railway.app/status/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "1",
        username: "Pawan",
        contentUrl,
        type,
        text,
      }),
    });

    refresh();
  };

  return (
    <div className="bg-white shadow p-3 rounded-xl">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <input
        type="text"
        placeholder="Write something..."
        onChange={(e) => setText(e.target.value)}
        className="border w-full p-2 mt-2 rounded"
      />

      <button
        onClick={upload}
        className="bg-green-500 w-full text-white p-2 mt-2 rounded-lg"
      >
        Upload Status
      </button>
    </div>
  );
}
