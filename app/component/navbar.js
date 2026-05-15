"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../UserContext.js";
import NotificationBell from "../NotificationBell.jsx";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { user, setUser, flag, setFlag, setCount } = useUserContext();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search/${search}`);
  };

  return (
    <>
      <nav className="w-full bg-gradient-to-r from-gray-900 to-black text-white px-4 sm:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg sticky top-0 z-50">

        {/* Top Row */}
        <div className="flex justify-between items-center w-full sm:w-auto">

          {/* Logo */}
          <div
            className="text-xl sm:text-2xl font-bold tracking-wide cursor-pointer hover:text-blue-400 transition"
            onClick={() => router.push("/")}
          >
            MyApp
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* 🔍 Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full sm:w-auto bg-white rounded-full px-3 py-1 shadow-md"
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-44 md:w-60 outline-none text-gray-800 px-2 text-sm"
          />
          <button className="text-gray-600 hover:text-black transition">
            🔍
          </button>
        </form>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-6 items-center text-sm md:text-base font-medium">

          {flag && <NotificationBell />}

          <button
            onClick={() => router.push("/chat")}
            className="hover:text-blue-400 transition"
          >
            Chat
          </button>

          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-400 transition"
          >
            Home
          </button>

          <button
            onClick={() => router.push("/Profile")}
            className="hover:text-blue-400 transition"
          >
            Profile
          </button>

          {flag ? (
            <button
              onClick={() => {
                setUser(null);
                setFlag(false);
                setCount(0);
                router.push("/form");
              }}
              className="text-red-400 hover:text-red-500 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/form")}
              className="text-green-400 hover:text-green-500 transition"
            >
              Login
            </button>
          )}

          <button
            onClick={() => router.push("/Add")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-md transition"
          >
            Add Product
          </button>
        </div>
      </nav>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gray-900 text-white flex flex-col gap-4 px-5 py-4 shadow-lg border-t border-gray-700">

          {flag && <NotificationBell />}

          <button
            onClick={() => router.push("/chat")}
            className="text-left hover:text-blue-400 transition"
          >
            Chat
          </button>

          <button
            onClick={() => router.push("/")}
            className="text-left hover:text-blue-400 transition"
          >
            Home
          </button>

          <button
            onClick={() => router.push("/Profile")}
            className="text-left hover:text-blue-400 transition"
          >
            Profile
          </button>

          {flag ? (
            <button
              onClick={() => {
                setUser(null);
                setFlag(false);
                setCount(0);
                router.push("/form");
              }}
              className="text-left text-red-400 hover:text-red-500 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/form")}
              className="text-left text-green-400 hover:text-green-500 transition"
            >
              Login
            </button>
          )}

          <button
            onClick={() => router.push("/Add")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-left transition"
          >
            Add Product
          </button>
        </div>
      )}
    </>
  );
}
