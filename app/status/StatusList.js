"use client";

import { useEffect, useState } from "react";

export default function StatusList({ refreshKey, onOpen }) {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetch("https://final-repository-3.onrender.com/status/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA 👉", data);

        // 🔥 FIX: ensure array
        if (Array.isArray(data)) {
          setStatuses(data);
        } else if (Array.isArray(data?.data)) {
          setStatuses(data.data);
        } else {
          setStatuses([]); // fallback
        }
      })
      .catch((err) => console.error(err));
  }, [refreshKey]);

  // 🔥 safe grouping
  const grouped = {};

  (statuses || []).forEach((s) => {
    if (!s || !s.username) return;

    if (!grouped[s.username]) {
      grouped[s.username] = [];
    }
    grouped[s.username].push(s);
  });

  const users = Object.entries(grouped);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Status</h2>

      <div className="flex gap-4 overflow-x-auto">
        {users.map(([username, userStatuses], index) => {
          const first = userStatuses?.[0];

          return (
            <div
              key={index}
              onClick={() => onOpen(userStatuses)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-yellow-500">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white text-xl">
                  {first?.username?.[0]?.toUpperCase() || "?"}
                </div>
              </div>

              <p className="text-sm mt-1 text-center max-w-[70px] truncate">
                {username || "Unknown"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
