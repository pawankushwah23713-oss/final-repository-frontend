"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "../UserContext.js";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [products, setProducts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [showLikes, setShowLikes] = useState(false);
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, flag } = useUserContext();
  const userEmail = user?.email;

  // ✅ SEARCH API CALL
  useEffect(() => {
    if (!query) return;

    setLoading(true);

    fetch(
      `https://final-repository-production.up.railway.app/api/products/search?q=${query}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [query]);

  // 💬 COMMENT
  const handleCommentSubmit = async (productId) => {
    const text = commentInputs[productId];
    if (!text) return alert("Empty comment!");

    const res = await fetch(
      `https://final-repository-production.up.railway.app/api/products/comment/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, email: userEmail }),
      }
    );

    const updatedProduct = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );

    setCommentInputs((prev) => ({ ...prev, [productId]: "" }));
  };

  // ❤️ LIKE
  const handleLike = async (productId) => {
    const res = await fetch(
      `https://final-repository-production.up.railway.app/api/products/like/${productId}?email=${userEmail}`,
      { method: "PUT" }
    );

    const updatedProduct = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );
  };

  const handleShowLikes = (likesArray) => {
    setSelectedLikes(likesArray || []);
    setShowLikes(true);
  };

  // ❌ DELETE COMMENT
  const handleDeleteComment = async (productId, index) => {
    if (!confirm("Delete your comment?")) return;

    const res = await fetch(
      `https://final-repository-production.up.railway.app/api/products/comment/${productId}/${index}?email=${userEmail}`,
      { method: "DELETE" }
    );

    const updatedProduct = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );
  };

  return (
    <div>
      {flag === true ? (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            padding: "40px",
            color: "white",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            🔍 Results for "{query}"
          </h1>

          {/* 🔄 Loading */}
          {loading && <p>Loading...</p>}

          {/* ❌ No Results */}
          {!loading && products.length === 0 && (
            <p>No products found</p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  background: "#1e293b",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                {/* USER */}
                <button
                  onClick={() =>
                    router.push(`/Profile/${encodeURIComponent(p.email)}`)
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#38bdf8",
                  }}
                >
                  {p.email}
                </button>

                {/* IMAGE */}
                {p.imageUrl && (
                  <motion.img
                    src={p.imageUrl}
                    alt={p.name}
                    whileHover={{ scale: 1.03 }}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      margin: "10px 0",
                    }}
                  />
                )}

                <h3>{p.name}</h3>
                <p style={{ color: "#cbd5f5" }}>{p.description}</p>
                <b>₹{p.price}</b>

                {/* ❤️ LIKE */}
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => handleLike(p.id)}
                    style={{
                      background: p.likedBy?.includes(userEmail)
                        ? "#22c55e"
                        : "#ef4444",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    {p.likedBy?.includes(userEmail)
                      ? "💔 Unlike"
                      : "❤️ Like"}
                  </button>

                  <span
                    onClick={() => handleShowLikes(p.likedBy)}
                    style={{
                      fontWeight: "bold",
                      color: "#facc15",
                      cursor: "pointer",
                    }}
                  >
                    👍 {p.likedBy ? p.likedBy.length : 0} likes
                  </span>
                </div>

                {/* 💬 CHAT */}
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() =>
                      router.push(`/chat/${encodeURIComponent(p.email)}`)
                    }
                    style={{
                      background: "#3b82f6",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    💬 Chat
                  </button>
                </div>

                {/* 💬 COMMENTS */}
                <div style={{ marginTop: "15px" }}>
                  <h4>💬 Comments</h4>

                  {p.comments?.length > 0 ? (
                    p.comments.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          background: "#334155",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          marginBottom: "5px",
                        }}
                      >
                        <span>
                          {c.message}{" "}
                          <small
                            onClick={() =>
                              router.push(
                                `/Profile/${encodeURIComponent(c.email)}`
                              )
                            }
                            style={{
                              color: "#38bdf8",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            ({c.email})
                          </small>
                        </span>

                        {c.email === userEmail && (
                          <button
                            onClick={() => handleDeleteComment(p.id, i)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "red",
                              cursor: "pointer",
                            }}
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "gray" }}>No comments</p>
                  )}
                </div>

                {/* ✍️ ADD COMMENT */}
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Write comment..."
                    value={commentInputs[p.id] || ""}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        [p.id]: e.target.value,
                      })
                    }
                    style={{
                      width: "70%",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "none",
                      marginRight: "5px",
                    }}
                  />

                  <button
                    onClick={() => handleCommentSubmit(p.id)}
                    style={{
                      background: "#22c55e",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <button onClick={() => router.push("/Auth")}>
            Login Required
          </button>
        </div>
      )}
    </div>
  );
}