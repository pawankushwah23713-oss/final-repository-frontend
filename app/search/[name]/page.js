
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserContext } from "../../UserContext.js";

export default function SearchPage({ params }) {
  const query = params.name; // ✅ URL param se direct

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

  if (flag !== true) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button onClick={() => router.push("/Auth")}>
          Login Required
        </button>
      </div>
    );
  }

  return (
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

      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && <p>No products found</p>}

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
            }}
          >
            <button
              onClick={() =>
                router.push(`/Profile/${encodeURIComponent(p.email)}`)
              }
              style={{ color: "#38bdf8", background: "transparent" }}
            >
              {p.email}
            </button>

            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}

            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <b>₹{p.price}</b>

            <div>
              <button onClick={() => handleLike(p.id)}>
                ❤️ Like
              </button>
            </div>

            {/* COMMENTS */}
            <div>
              <h4>Comments</h4>

              {p.comments?.map((c, i) => (
                <div key={i}>
                  {c.message} ({c.email})

                  {c.email === userEmail && (
                    <button
                      onClick={() => handleDeleteComment(p.id, i)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>

            <input
              value={commentInputs[p.id] || ""}
              onChange={(e) =>
                setCommentInputs({
                  ...commentInputs,
                  [p.id]: e.target.value,
                })
              }
              placeholder="Write comment"
            />

            <button onClick={() => handleCommentSubmit(p.id)}>
              Send
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
