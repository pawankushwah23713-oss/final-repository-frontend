"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useUserContext } from "@/app/UserContext";
import { motion } from "framer-motion";

export default function ChatPage() {
  const params = useParams();
  const { user, flag } = useUserContext();

  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const chatEndRef = useRef(null);

  const customEmojis = [/* SAME ARRAY */];

  useEffect(() => {
    if (user?.email) setSender(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (params?.name) setReceiver(decodeURIComponent(params.name));
  }, [params?.name]);

  useEffect(() => {
    if (!user?.email) return;

    const socket = new SockJS(
      "https://final-repository-3.onrender.com/ws?username=" +
        encodeURIComponent(user.email)
    );

    const client = new Client({
      webSocketFactory: () => socket,

      onConnect: async () => {
        setIsConnected(true);

        try {
          const res = await fetch(
            `https://final-repository-3.onrender.com/api/pending?username=${user.email}`
          );
          const data = await res.json();

          const updated = data.map((m) => ({
            ...m,
            status: m.delivered ? "delivered" : "sent",
          }));

          setChat((prev) => [...prev, ...updated]);
        } catch (err) {
          console.error(err);
        }

        client.subscribe("/user/queue/messages", (msg) => {
          const data = JSON.parse(msg.body);
          setChat((prev) => [...prev, { ...data, status: "delivered" }]);
        });

        client.subscribe("/user/queue/typing", (msg) => {
          const data = JSON.parse(msg.body);
          if (data.sender === receiver) {
            setIsTyping(data.typing);
          }
        });
      },

      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [user?.email, receiver]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  const sendMessage = () => {
    if (!receiver || !message || !isConnected) return;

    const msg = {
      sender,
      receiver,
      content: message,
      status: "sent",
    };

    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(msg),
    });

    setChat((prev) => [...prev, msg]);
    setMessage("");
    setShowEmoji(false);

    sendTyping(false);
  };

  const sendTyping = (typing) => {
    if (!isConnected) return;

    stompClient.publish({
      destination: "/app/typing",
      body: JSON.stringify({
        sender,
        receiver,
        typing,
      }),
    });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isConnected) return;

    sendTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1000);
  };

  const handleCustomEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.value);
  };

  const renderMessage = (text) => text;

  const getStatusIcon = (status) => {
    if (status === "sent") return "✓";
    if (status === "delivered") return "✓✓";
    if (status === "seen") return "✓✓";
  };

  return (
    <div>
      {flag ? (
        <div className="h-screen flex flex-col bg-gray-100">

          {/* Header */}
          <div className="bg-blue-600 text-white px-3 py-3 sm:px-4 flex justify-between items-center">
            <div className="truncate">
              <div className="text-sm sm:text-base font-semibold truncate">
                {receiver}
              </div>
              <div className="text-xs">
                {isTyping ? "typing..." : "Online"}
              </div>
            </div>
            <div className="text-xl sm:text-2xl">👤</div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-2">
            {chat.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  msg.sender === sender
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 sm:px-4 rounded-2xl max-w-[75%] sm:max-w-xs md:max-w-md break-words ${
                    msg.sender === sender
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <div className="text-sm sm:text-base">
                    {renderMessage(msg.content)}
                  </div>

                  {msg.sender === sender && (
                    <div className="text-[10px] sm:text-xs text-right mt-1">
                      {getStatusIcon(msg.status)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="text-xs sm:text-sm italic text-gray-500">
                typing...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 sm:p-3 bg-white flex gap-2 items-center relative">

            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-xl sm:text-2xl"
            >
              😊
            </button>

            {showEmoji && (
              <div className="absolute bottom-14 left-2 right-2 sm:left-auto sm:w-72 bg-white p-2 grid grid-cols-6 sm:grid-cols-8 gap-2 shadow-lg rounded-lg max-h-40 overflow-y-auto">
                {customEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => handleCustomEmoji(emoji)}
                    className="text-lg"
                  >
                    {emoji.value}
                  </button>
                ))}
              </div>
            )}

            <input
              value={message}
              onChange={handleTyping}
              className="flex-1 border px-3 py-2 text-sm sm:text-base rounded-full"
              placeholder="Type message..."
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center text-lg">
          Login Required
        </div>
      )}
    </div>
  );
}
