"use client";
import { useRef, useState } from "react";
import { useUserContext } from "../UserContext.js";

export default function StatusUploaderUI({ onClose, refresh }) {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const pickFile = () => fileRef.current.click();
  const { user } = useUserContext();

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://final-repository-3.onrender.com/file/upload", {
      method: "POST",
      body: formData,
    });

    const url = await res.text();

    await fetch("https://final-repository-3.onrender.com/status/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "1",
        username: user?.email,
        contentUrl: url,
        type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
      }),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center">
        {preview ? (
          file.type.startsWith("video") ? (
            <video
              src={preview}
              className="max-h-[80vh]"
              controls
            />
          ) : (
            <img
              src={preview}
              className="max-h-[80vh]"
            />
          )
        ) : (
          <p>Select media</p>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-center p-6 bg-black/60 backdrop-blur-md">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="bg-red-500 px-3 py-1 rounded-lg text-white"
        >
          ✖
        </button>

        {/* FILE PICK */}
        <div className="flex gap-6">
          <button
            onClick={pickFile}
            className="bg-gray-700 p-3 rounded-full"
          >
            📁
          </button>

          <button
            onClick={pickFile}
            className="w-16 h-16 border-4 border-white rounded-full"
          ></button>
        </div>

        {/* SEND */}
        <button
          onClick={upload}
          className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold shadow-lg"
        >
          Send ➤
        </button>

        <input
          type="file"
          hidden
          ref={fileRef}
          onChange={handleFile}
        />
      </div>
    </div>
  );
}
