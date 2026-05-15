"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserContext } from "@/app/UserContext";

import StatusList from "../status/StatusList";
import StoryViewer from "../status/StoryViewer";
import StatusUploaderUI from "../status/StatusUploaderUI";

export default function Home() {
  const [viewer, setViewer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openUpload, setOpenUpload] = useState(false);
  const [users, setUsers] = useState([]);

  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState(null);

  const [activeTab, setActiveTab] = useState("chat");

  const { user, flag } = useUserContext();
  const router = useRouter();

  const refresh = () => setRefreshKey((p) => p + 1);

  const currentUser = user?.email;

  useEffect(() => {
    if (!user?.email) return;

    const fetchUsers = async () => {
      const res = await fetch(
        `https://final-repository-3.onrender.com/api/users?email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();
      setUsers(data || []);
    };

    fetchUsers();
  }, [user]);

  const fetchSongs = async () => {
    const res = await fetch("https://final-repository-3.onrender.com/music/all");
    const data = await res.json();
    setSongs(data);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const likeSong = async (id) => {
    await fetch(`https://final-repository-3.onrender.com/music/like/${id}`, {
      method: "PUT",
    });
    fetchSongs();
  };

  const deleteSong = async (id) => {
    if (!confirm("Delete this song?")) return;

    await fetch(
      `https://final-repository-3.onrender.com/music/delete/${id}?username=${user?.email}`,
      { method: "DELETE" }
    );

    fetchSongs();
  };

  const handleSearch = async () => {
    const res = await fetch(
      `https://final-repository-3.onrender.com/music/search?query=${search}`
    );
    const data = await res.json();
    setSongs(data);
  };

  const openChat = (email) => {
    router.push(`/chat/${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100 text-gray-900">

      {/* TOP NAV */}
      <div className="flex justify-around bg-white shadow-md p-2 sticky top-0 z-50">
        {["status", "chat", "music"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col md:flex-row">

        {/* STATUS */}
        {activeTab === "status" && (
          <div className="w-full md:w-[30%] min-w-[250px] bg-white/80 backdrop-blur-xl border-r flex flex-col shadow-lg text-gray-900">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 font-bold text-lg">
              Status
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <StatusList
                refreshKey={refreshKey}
                onOpen={(statuses) =>
                  setViewer({ index: 0, statuses })
                }
              />
            </div>

            <div className="p-3">
              <button
                onClick={() => setOpenUpload(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
              >
                + Add Status
              </button>
            </div>
          </div>
        )}

        {/* CHAT */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col text-gray-900">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 font-bold text-lg">
              Chats
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!flag ? (
                <div className="text-center mt-20 text-gray-900">
                  <p>Login required</p>
                  <button
                    onClick={() => router.push("/form")}
                    className="mt-4 bg-blue-600 px-5 py-2 rounded-xl text-white"
                  >
                    Login
                  </button>
                </div>
              ) : (
                users.map((u, i) => (
                  <motion.div
                    key={i}
                    onClick={() => openChat(u.email)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-4 rounded-2xl shadow-md mb-3 cursor-pointer hover:shadow-xl text-gray-900"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        {u?.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{u.email}</div>
                        <div className="text-sm text-gray-600">
                          Start chatting
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MUSIC */}
      {activeTab === "music" && (
        <div className="bg-white/80 backdrop-blur-xl text-gray-900 p-4 md:p-6 overflow-y-auto">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🎵 Music Zone</h1>

            <button
              onClick={() => router.push("/music/upload")}
              className="bg-green-500 text-white px-5 py-2 rounded-xl"
            >
              + Add Music
            </button>
          </div>

          {/* SEARCH */}
          <div className="flex gap-3 mb-6 flex-col sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs..."
              className="p-3 rounded-xl bg-white shadow w-full text-gray-900 placeholder-gray-500"
            />
            <button className="bg-green-500 text-white px-5 rounded-xl">
              Search
            </button>
          </div>

          {/* SONGS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {songs.map((song, i) => (
              <motion.div
                key={song.id}
                className="bg-white p-4 rounded-2xl shadow-md text-gray-900"
              >
                <h2 className="font-semibold text-gray-900">{song.title}</h2>
                <p className="text-sm text-gray-600">{song.artist}</p>

                <div className="flex justify-between mt-3">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-full">
                    ▶
                  </button>

                  <button className="text-red-500">
                    ❤️ {song.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
