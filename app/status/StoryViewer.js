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
  const {user,setUser,flag,setFlag} = useUserContext();
  

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
      `https://final-repository-production.up.railway.app/status/seen/${status.id}?userId=1`,
      { method: "POST" }
    );
  }, [index]);

  // 🔥 DELETE FUNCTION
  const deleteStatus = async () => {
    if (!confirm("Delete this status?")) return;

    // ✅ sahi
 await fetch(`https://final-repository-production.up.railway.app/status/${status.id}?username=${user.email}`, {
  method: "DELETE",
})

    // Move next or close
    if (statuses.length > 1) {
      setIndex((prev) =>
        prev < statuses.length - 1 ? prev : prev - 1
      );
    } else {
      onClose();
    }

    onDelete(); // refresh list
  };

  if (!status) return null;

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">

      {/* Top */}
      <div className="flex justify-between p-4">
        <div>
          <h2>{status.username}</h2>
          <p className="text-xs">
            Seen: {status.seenBy?.length || 0}
          </p>
        </div>

        <div className="flex gap-3">
          {/* 🔥 Delete button (only own status) */}
          {status.userId === "1" && (
            <button
              onClick={deleteStatus}
              className="text-red-500"
            >
              🗑
            </button>
          )}

          <button onClick={onClose}>✖</button>
        </div>
      </div>

      {/* Content */}
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
          <img src={status.contentUrl} className="max-h-[80vh]" />
        )}

        {status.type === "VIDEO" && (
          <video src={status.contentUrl} autoPlay controls />
        )}

        {status.type === "TEXT" && (
          <h1 className="text-3xl">{status.text}</h1>
        )}
      </div>

      {/* Progress */}
      <div className="flex gap-1 p-2">
        {statuses.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 ${
              i <= index ? "bg-white" : "bg-gray-600"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}