"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "../UserContext.js";

export default function StoryViewer({
  statuses,
  startIndex,
  onClose,
  onDelete,
}) {
  const [index, setIndex] = useState(startIndex);
  const status = statuses[index];
  const { user } = useUserContext();

  // Auto next
  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < statuses.length - 1) {
        setIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [index, statuses.length]);

  // Mark seen
  useEffect(() => {
    if (!status) return;

    fetch(
      `https://final-repository-3.onrender.com/status/seen/${status.id}?userId=1`,
      { method: "POST" }
    );
  }, [index]);

  // DELETE FUNCTION
  const deleteStatus = async () => {
    if (!confirm("Delete this status?")) return;

    await fetch(
      `https://final-repository-3.onrender.com/status/${status.id}?username=${user.email}`,
      { method: "DELETE" }
    );

    if (statuses.length > 1) {
      setIndex((prev) =>
        prev < statuses.length - 1 ? prev : prev - 1
      );
    } else {
      onClose();
    }

    onDelete();
  };

  if (!status) return null;

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">

      {/* TOP */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h2 className="font-semibold">{status.username}</h2>
        </div>

        <button onClick={onClose} className="text-xl">
          ✖
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center relative">

        {/* Left */}
        <div
          className="absolute left-0 top-0 h-full w-1/2"
          onClick={() => index > 0 && setIndex(index - 1)}
        />

        {/* Right */}
        <div
          className="absolute right-0 top-0 h-full w-1/2"
          onClick={() =>
            index < statuses.length - 1
              ? setIndex(index + 1)
              : onClose()
          }
        />

        {/* Content */}
        {status.type === "IMAGE" && (
          <img src={status.contentUrl} className="max-h-[80vh] rounded-lg" />
        )}

        {status.type === "VIDEO" && (
          <video
            src={status.contentUrl}
            autoPlay
            controls
            className="max-h-[80vh] rounded-lg"
          />
        )}

        {status.type === "TEXT" && (
          <h1 className="text-3xl text-center px-4">{status.text}</h1>
        )}
      </div>

      {/* PROGRESS */}
      <div className="flex gap-1 px-2">
        {statuses.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 ${
              i <= index ? "bg-white" : "bg-gray-600"
            }`}
          ></div>
        ))}
      </div>

      {/* 🔥 BOTTOM CONTROLS (NEW UI) */}
      <div className="p-4 flex justify-between items-center bg-black/60 backdrop-blur-md">

        {/* Seen Count */}
        <div className="text-sm text-gray-300">
          Seen: {status.seenBy?.length || 0}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          {/* Delete Button */}
          {status.userId === "1" && (
            <button
              onClick={deleteStatus}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full flex items-center gap-2 transition"
            >
              🗑 <span>Delete</span>
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-full transition"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
}
