"use client";

import { useState, useRef } from "react";
import { useUserContext } from "@/app/UserContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UploadMusic() {
  const { user, flag } = useUserContext();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const fileRef = useRef();

  const handleUpload = async () => {
    if (!file || !title || !artist) {
      alert("All fields required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("username", user?.email);

    try {
      const res = await fetch("https://final-repository-production.up.railway.app/music/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Uploaded ✅");

        setFile(null);
        setTitle("");
        setArtist("");
        fileRef.current.value = "";
      } else {
        alert("Upload failed ❌");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-black via-gray-900 to-gray-800">

      {flag ? (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-5 sm:p-8 w-full max-w-md text-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-center">
            🎵 Upload Music
          </h2>

          {/* Title */}
          <input
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 sm:mb-4 p-2.5 sm:p-3 text-sm sm:text-base rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Artist */}
          <input
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full mb-3 sm:mb-4 p-2.5 sm:p-3 text-sm sm:text-base rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* File Upload */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm text-gray-300">
              Upload Audio
            </label>

            <input
              type="file"
              accept="audio/*"
              ref={fileRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs sm:text-sm text-gray-300"
            />

            {file && (
              <p className="text-green-400 text-xs sm:text-sm mt-2 break-all">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="w-full bg-green-500 hover:bg-green-600 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold transition duration-200 hover:scale-105"
          >
            Upload Now 🚀
          </button>
        </motion.div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 w-full px-4">

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-10 text-center max-w-md w-full"
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔒</div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
              Login Required
            </h2>

            <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6">
              Please login to upload and manage your music.
            </p>

            <button
              onClick={() => router.push("/form")}
              className="bg-white text-purple-600 text-sm sm:text-base font-semibold py-2 px-5 sm:px-6 rounded-xl hover:scale-105 hover:bg-purple-100 transition"
            >
              Login Now
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}