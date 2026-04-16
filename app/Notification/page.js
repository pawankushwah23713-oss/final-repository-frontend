"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useUserContext } from "../UserContext";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const { user } = useUserContext();
  const userEmail = user?.email;

  const router = useRouter();

  useEffect(() => {
    if (!userEmail) return;

    console.log("👤 USER:", userEmail);

    // ✅ 1. FETCH OFFLINE NOTIFICATIONS
    fetch(
      `https://final-repository-production.up.railway.app/api/products/pending?username=${encodeURIComponent(
        userEmail
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 OFFLINE:", data);

        const formatted = data.map((n) => ({
          sender: n.sender || "Unknown",
          content: n.content || "",
          type: n.type,
          productId: n.productId || null,
          comment: n.comment || null,
          productName: n.productName || "",
        }));

        setNotifications(formatted);
      });

    // ✅ 2. SOCKET CONNECT
    const socket = new SockJS(
      "https://final-repository-production.up.railway.app/ws?username=" +
        encodeURIComponent(userEmail) // 🔥 FIXED
    );

    const client = new Client({
      webSocketFactory: () => socket,

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log("✅ WS CONNECTED:", userEmail);

        // 🔥 PRIVATE NOTIFICATIONS
        client.subscribe("/user/queue/messages", (msg) => {
          const data = JSON.parse(msg.body);

          console.log("📩 PRIVATE:", data);

          if (!data?.type) return;

          setNotifications((prev) => [
            {
              sender: data.sender || "Unknown",
              content: data.content || "",
              type: data.type,
              productId: data.productId || null,
              comment: data.comment || null,
              productName: data.productName || "",
            },
            ...prev,
          ]);
        });

        // 🔥 GLOBAL NOTIFICATIONS
        client.subscribe("/topic/products", (msg) => {
          const data = JSON.parse(msg.body);

          console.log("🌍 GLOBAL:", data);

          if (!data?.type) return;

          // ❌ ignore self
          if (data.sender === userEmail || data.email === userEmail) return;

          // ❌ ignore private messages
          if (data.receiver) return;

          setNotifications((prev) => [
            {
              sender: data.sender || data.email || "Unknown",
              content: data.content || "",
              type: data.type,
              productId: data.productId || null,
              comment: data.comment || null,
              productName: data.productName || "",
            },
            ...prev,
          ]);
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP ERROR:", frame);
      },

      onWebSocketError: (err) => {
        console.error("❌ WS ERROR:", err);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userEmail]);

  return (
    <div style={{ position: "relative" }}>
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "26px",
          cursor: "pointer",
          position: "relative",
        }}
      >
        🔔

        {notifications.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "3px 6px",
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "90vw",
            maxWidth: "380px",
            maxHeight: "70vh",
            overflowY: "auto",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            padding: "10px",
            zIndex: 999,
          }}
        >
          <h4>Notifications</h4>

          {notifications.length === 0 && <p>No notifications</p>}

          {notifications.map((n, i) => (
            <div
              key={i}
              onClick={() => {
                if (n.productId) {
                  router.push(`/product/${n.productId}`);
                }
              }}
              style={{
                padding: "8px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <div>
                {n.type === "PRODUCT_ADD" && "🛒"}
                {n.type === "PRODUCT_LIKE" && "❤️"}
                {n.type === "PRODUCT_COMMENT" && "💬"}
                {n.type === "PRODUCT_DELETE" && "❌"}{" "}
                {n.sender}
              </div>

              <div style={{ fontSize: "13px" }}>
                {n.type === "PRODUCT_COMMENT" && n.comment
                  ? `commented on ${n.productName}: "${n.comment}"`
                  : n.type === "PRODUCT_LIKE"
                  ? `liked ${n.productName}`
                  : n.type === "PRODUCT_ADD"
                  ? `added ${n.productName}`
                  : n.type === "PRODUCT_DELETE"
                  ? `deleted ${n.productName}`
                  : n.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
