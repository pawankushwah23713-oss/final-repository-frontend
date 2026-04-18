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

  const { user, flag } = useUserContext();
  const router = useRouter();

  const refresh = () => setRefreshKey((p) => p + 1);

  const currentUser = user?.email;

  // USERS
  useEffect(() => {
    if (!user?.email) return;

    const fetchUsers = async () => {
      const res = await fetch(
        `https://final-repository-production.up.railway.app/api/users?email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();
      setUsers(data || []);
    };

    fetchUsers();
  }, [user]);

  // MUSIC
  const fetchSongs = async () => {
    const res = await fetch("https://final-repository-production.up.railway.app/music/all");
    const data = await res.json();
    setSongs(data);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const likeSong = async (id) => {
    await fetch(`https://final-repository-production.up.railway.app/music/like/${id}`, {
      method: "PUT",
    });
    fetchSongs();
  };

  const deleteSong = async (id) => {
    if (!confirm("Delete this song?")) return;

    await fetch(
      `https://final-repository-production.up.railway.app/music/delete/${id}?username=${user?.email}`,
      { method: "DELETE" }
    );

    fetchSongs();
  };

  const handleSearch = async () => {
    const res = await fetch(
      `https://final-repository-production.up.railway.app/music/search?query=${search}`
    );
    const data = await res.json();
    setSongs(data);
  };

  const openChat = (email) => {
    router.push(`/chat/${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100">

      {/* TOP */}
      <div className="flex flex-1">

        {/* STATUS */}
        <div className="w-[30%] min-w-[300px] max-w-[400px] bg-white/70 backdrop-blur-xl border-r flex flex-col shadow-lg">
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
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl shadow-md hover:scale-105 transition"
            >
              + Add Status
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 font-bold text-lg shadow-md">
            Chats
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!flag ? (
              <div className="text-center mt-20">
                <p>Login required</p>
                <button
                  onClick={() => router.push("/form")}
                  className="mt-4 bg-blue-500 px-5 py-2 rounded-xl text-white hover:scale-105 transition"
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
                  className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-md mb-3 cursor-pointer hover:shadow-xl transition"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
                      {u?.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{u.email}</div>
                      <div className="text-sm text-gray-500">
                        Start chatting
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MUSIC */}
      <div className="bg-white/60 backdrop-blur-xl text-gray-900 p-6 overflow-y-auto shadow-inner">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎵 Music Zone</h1>

          <button
            onClick={() => router.push("/music/upload")}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl shadow-md hover:scale-105 transition"
          >
            + Add Music
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs..."
            className="p-3 rounded-xl bg-white shadow w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-5 rounded-xl hover:scale-105 transition"
          >
            Search
          </button>
        </div>

        {/* SONGS */}
        <div className="grid md:grid-cols-4 gap-5">
          {songs.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.07 }}
              className="relative bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {/* DELETE BUTTON */}
              {currentUser === song.username && (
                <button
                  onClick={() => deleteSong(song.id)}
                  className="absolute top-2 right-2 text-red-500 bg-white rounded-full px-2 py-1 shadow hover:bg-red-100 hover:scale-110 transition"
                >
                  delete
                </button>
              )}

              <h2 className="font-semibold">{song.title}</h2>
              <p className="text-sm text-gray-500">{song.artist}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => setCurrentSong(song)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full hover:scale-110 transition"
                >
                  ▶
                </button>

                <button
                  onClick={() => likeSong(song.id)}
                  className="hover:scale-110 transition"
                >
                  ❤️ {song.likes}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FLOAT BUTTON */}
      <button
        onClick={() => router.push("/music/upload")}
        className="fixed bottom-20 right-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white w-14 h-14 rounded-full text-2xl shadow-xl hover:scale-110 transition"
      >
        +
      </button>

      {/* PLAYER */}
      {currentSong && (
        <div className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl p-4 flex justify-between items-center shadow-lg">
          <div>
            <h3>{currentSong.title}</h3>
            <p className="text-sm text-gray-500">
              {currentSong.artist}
            </p>
          </div>

          <audio controls autoPlay src={currentSong.url}></audio>
        </div>
      )}

      {/* MODALS */}
      {openUpload && (
        <StatusUploaderUI
          onClose={() => setOpenUpload(false)}
          refresh={refresh}
        />
      )}

      {viewer && (
        <StoryViewer
          statuses={viewer.statuses}
          startIndex={viewer.index}
          onClose={() => setViewer(null)}
          onDelete={refresh}
        />
      )}
    </div>
  );
}
