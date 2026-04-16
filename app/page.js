"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserContext } from "./UserContext.js";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [showLikes, setShowLikes] = useState(false);
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [showComments, setShowComments] = useState({});

  const router = useRouter();
  const { user, flag } = useUserContext();

  const userEmail = user?.email;

  useEffect(() => {
    fetch("https://final-repository-production.up.railway.app/api/products/all")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const handleCommentSubmit = async (productId) => {
    const text = commentInputs[productId];
    if (!text) return alert("Empty comment!");

    const res = await fetch(
      `https://final-repository-production.up.railway.app/api/products/comment/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          email: userEmail,
        }),
      }
    );

    const updatedProduct = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );

    setCommentInputs((prev) => ({ ...prev, [productId]: "" }));
  };

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
      {flag ? (
        <div
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
            padding: "40px",
            color: "white",
          }}
        >
          {/* 🔥 Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "32px",
              letterSpacing: "1px",
            }}
          >
            🚀 All Products
          </motion.h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "25px",
            }}
          >
            {products.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                }}
                style={{
                  backdropFilter: "blur(15px)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "20px",
                  borderRadius: "15px",
                  transition: "0.3s",
                }}
              >
                {/* EMAIL */}
                <button
                  onClick={() =>
                    router.push(`/Profile/${encodeURIComponent(p.email)}`)
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#38bdf8",
                    fontSize: "13px",
                  }}
                >
                  👤 {p.email}
                </button>

                {/* IMAGE */}
                {p.imageUrl && (
                  <motion.img
                    src={p.imageUrl}
                    alt={p.name}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      margin: "12px 0",
                    }}
                  />
                )}

                <h3 style={{ marginBottom: "5px" }}>{p.name}</h3>
                <p style={{ color: "#cbd5f5", fontSize: "14px" }}>
                  {p.description}
                </p>

                <b style={{ color: "#22c55e" }}>₹{p.price}</b>

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
                      borderRadius: "20px",
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
                    👍 {p.likedBy ? p.likedBy.length : 0}
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
                      borderRadius: "20px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    💬 Chat
                  </button>
                </div>

                {/* TOGGLE COMMENTS */}
                <div style={{ marginTop: "15px" }}>
                  <button
                    onClick={() =>
                      setShowComments((prev) => ({
                        ...prev,
                        [p.id]: !prev[p.id],
                      }))
                    }
                    style={{
                      background: "#64748b",
                      border: "none",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    {showComments[p.id]
                      ? "Hide Comments"
                      : "Show Comments"}
                  </button>
                </div>

                {/* COMMENTS */}
                {showComments[p.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    style={{ marginTop: "10px" }}
                  >
                    <h4>💬 Comments</h4>

                    {p.comments?.length > 0 ? (
                      p.comments.map((c, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            background: "#1e293b",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            marginBottom: "6px",
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
                              }}
                            >
                              ({c.email})
                            </small>
                          </span>

                          {c.email === userEmail && (
                            <button
                              onClick={() =>
                                handleDeleteComment(p.id, i)
                              }
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
                          borderRadius: "20px",
                          border: "none",
                          marginRight: "5px",
                        }}
                      />

                      <button
                        onClick={() => handleCommentSubmit(p.id)}
                        style={{
                          background: "#22c55e",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          <motion.div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 text-center max-w-md w-full">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Access Restricted
            </h2>
            <p className="text-white/80 mb-6">
              You need to login to view products.
            </p>

            <button
              onClick={() => router.push("/Auth")}
              className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-xl"
            >
              Login Now
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}