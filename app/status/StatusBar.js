"use client";

import { useEffect, useState } from "react";

export default function StatusBar({ onOpen }) {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    fetch("https://final-repository-production.up.railway.app/status/all")
      .then(res => res.json())
      .then(data => {
        // group by userId
        const grouped = data.reduce((acc, s) => {
          if (!acc[s.userId]) acc[s.userId] = [];
          acc[s.userId].push(s);
          return acc;
        }, {});
        setStatuses(grouped);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto p-3 bg-black">
      {Object.keys(statuses).map((userId) => {
        const userStatuses = statuses[userId];
        const first = userStatuses[0];

        return (
          <div
            key={userId}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onOpen(userStatuses)}
          >
            <div className="w-14 h-14 rounded-full border-2 border-green-500 overflow-hidden">
              {first.type === "IMAGE" ? (
                <img src={first.contentUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="bg-gray-700 w-full h-full" />
              )}
            </div>
            <p className="text-white text-xs mt-1">{first.username}</p>
          </div>
        );
      })}
    </div>
  );
}