"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../UserContext.js";
import NotificationBell from "../NotificationBell.jsx";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // 👈 NEW
  const router = useRouter();
  const { user, setUser, flag, setFlag, setCount } = useUserContext();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?query=${search}`);
  };

  return (
    <>
      <nav className="w-full bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 shadow-lg">

        {/* Top Row */}
        <div className="flex justify-between items-center w-full sm:w-auto">

          {/* Logo */}
          <div
            className="text-lg sm:text-xl font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            MyApp
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>

        {/* 🔍 Search Box */}
        <form
          onSubmit={handleSearch}
          className="flex w-full sm:w-auto bg-white rounded-full px-3 py-1"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-40 md:w-56 outline-none text-black px-2 text-sm sm:text-base"
          />
          <button type="submit">🔍</button>
        </form>

        {/* Desktop Right Side */}
        <div className="hidden sm:flex gap-6 items-center text-sm sm:text-base">

          {flag && <NotificationBell />}

          <button onClick={() => router.push("/chat")}>Chat</button>

          <button onClick={() => router.push("/")}>Home</button>

          {flag ? (
            <button
              onClick={() => {
                setUser(null);
                setFlag(false);
                setCount(0);
                router.push("/form");
              }}
              className="text-red-400"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/form")}
              className="text-green-400"
            >
              Login
            </button>
          )}

          <button onClick={() => router.push("/Profile")}>
            Profile
          </button>

          <button
            onClick={() => router.push("/Add")}
            className="bg-blue-600 px-4 py-1 rounded-lg"
          >
            Add Product
          </button>
        </div>
      </nav>

      {/* 📱 Mobile Sidebar */}
      {menuOpen && (
        <div className="sm:hidden bg-black text-white flex flex-col gap-4 px-4 py-4 shadow-lg">

          {flag && <NotificationBell />}

          <button onClick={() => router.push("/chat")}>Chat</button>

          <button onClick={() => router.push("/")}>Home</button>

          {flag ? (
            <button
              onClick={() => {
                setUser(null);
                setFlag(false);
                setCount(0);
                router.push("/form");
              }}
              className="text-red-400"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/form")}
              className="text-green-400"
            >
              Login
            </button>
          )}

          <button onClick={() => router.push("/Profile")}>
            Profile
          </button>

          <button
            onClick={() => router.push("/Add")}
            className="bg-blue-600 px-3 py-1 rounded-lg"
          >
            Add Product
          </button>
        </div>
      )}
    </>
  );
}