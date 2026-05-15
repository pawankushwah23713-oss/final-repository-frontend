"use client";
import { useUserContext } from "./UserContext.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);
  const userEmail = user?.email;
  const router = useRouter();

  useEffect(() => {
    if (!userEmail) return;

    const fetchNotifications = () => {
      fetch(
        `https://final-repository-3.onrender.com/api/products/pending?username=${encodeURIComponent(
          userEmail
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setNotifications((prev) => {
            const existingIds = new Set(
              prev.map(
                (n) => n.id || n.productId + n.type + n.sender
              )
            );
            const newItems = (data || []).filter(
              (n) =>
                !existingIds.has(
                  n.id || n.productId + n.type + n.sender
                )
            );
            return [...newItems, ...prev];
          });
        })
        .catch((err) =>
          console.error("Fetch notifications error:", err)
        );
    };

    fetchNotifications();
    window.addEventListener("online", fetchNotifications);

    const socket = new SockJS(
      `https://final-repository-3.onrender.com/ws?username=${encodeURIComponent(
        userEmail
      )}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        const handleMessage = (msg) => {
          const data = JSON.parse(msg.body || "{}");

          setNotifications((prev) => {
            const exists = prev.some(
              (n) =>
                (n.id ||
                  n.productId + n.type + n.sender) ===
                (data.id ||
                  data.productId + data.type + data.sender)
            );
            return exists ? prev : [data, ...prev];
          });
        };

        client.subscribe("/user/queue/messages", handleMessage);
        client.subscribe("/topic/products", handleMessage);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      window.removeEventListener("online", fetchNotifications);
    };
  }, [userEmail]);

  const markAllRead = () => setNotifications([]);

  return (
    <div className="relative">
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl sm:text-2xl hover:scale-110 transition"
      >
        🔔
        {notifications.length > 0 && (
          <>
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          </>
        )}
      </button>

      {/* 📱 Dropdown */}
      {open && (
        <div className="
          absolute right-0 mt-3 
          w-[90vw] sm:w-80 
          max-h-[70vh] 
          overflow-y-auto 
          bg-white text-black 
          rounded-xl shadow-2xl 
          p-3 z-50
        ">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm sm:text-base">
              Notifications
            </h4>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Empty */}
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No notifications
            </p>
          ) : (
            notifications.map((n, i) => (
              <div
                key={i}
                onClick={() => {
                  if (n.productId)
                    router.push(`/product/${n.productId}`);
                  setNotifications((prev) =>
                    prev.filter((_, idx) => idx !== i)
                  );
                }}
                className="
                  p-3 mb-2 
                  border rounded-lg 
                  hover:bg-gray-100 
                  cursor-pointer 
                  transition
                "
              >
                <div className="flex gap-2 items-center font-medium text-sm sm:text-base">
                  {n.type === "PRODUCT_ADD" && "🛒"}
                  {n.type === "PRODUCT_LIKE" && "❤️"}
                  {n.type === "PRODUCT_COMMENT" && "💬"}
                  <span className="truncate">
                    {n.sender || n.email}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-600 ml-6 break-words">
                  {n.type === "PRODUCT_COMMENT"
                    ? `commented: "${n.message}"`
                    : n.type === "PRODUCT_LIKE"
                    ? `liked your product`
                    : n.type === "PRODUCT_ADD"
                    ? `added product`
                    : n.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
