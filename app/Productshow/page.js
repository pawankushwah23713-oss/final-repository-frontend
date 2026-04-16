"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserContext } from "../UserContext.js";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [showLikes, setShowLikes] = useState(false);
  const [selectedLikes, setSelectedLikes] = useState([]);

  const router = useRouter();
  const { user } = useUserContext();

  const userEmail = user?.email;

  useEffect(() => {
    fetch("https://shopingbackend-production.up.railway.app/api/products/all")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // 💬 ADD COMMENT
  const handleCommentSubmit = async (productId) => {
    const text = commentInputs[productId];
    if (!text) return alert("Empty comment!");

    const res = await fetch(
      `https://shopingbackend-production.up.railway.app/api/products/comment/${productId}`,
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

  // ❤️ LIKE
  const handleLike = async (productId) => {
    const res = await fetch(
      `https://shopingbackend-production.up.railway.app/api/products/like/${productId}?email=${userEmail}`,
      { method: "PUT" }
    );

    const updatedProduct = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );
  };

  // 👀 SHOW LIKES POPUP
  const handleShowLikes = (likesArray) => {
    setSelectedLikes(likesArray || []);
    setShowLikes(true);
  };

  // ❌ DELETE COMMENT
  const handleDeleteComment = async (productId, index) => {
    if (!confirm("Delete your comment?")) return;

    const res = await fetch(
      `https://shopingbackend-production.up.railway.app/api/products/comment/${productId}/${index}?email=${userEmail}`,
      { method: "DELETE" }
    );

    const updatedProduct = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "40px",
        color: "white",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        🚀 All Products
      </h1>

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
            {/* USER EMAIL */}
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

            <h3>{p.name}</h3>
            <p style={{ color: "#cbd5f5" }}>{p.description}</p>
            <b>₹{p.price}</b>

            {/* ❤️ LIKE SECTION */}
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

              {/* 🔢 CLICKABLE LIKE COUNT */}
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

      {/* ❤️ LIKE MODAL */}
      {showLikes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              width: "300px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <h3>❤️ Liked by</h3>

            {selectedLikes.length > 0 ? (
              selectedLikes.map((email, i) => (
                <div
                  key={i}
                  onClick={() =>
                    router.push(`/Profile/${encodeURIComponent(email)}`)
                  }
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #334155",
                    cursor: "pointer",
                    color: "#38bdf8",
                  }}
                >
                  {email}
                </div>
              ))
            ) : (
              <p>No likes yet</p>
            )}

            <button
              onClick={() => setShowLikes(false)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "6px",
                background: "#ef4444",
                border: "none",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}