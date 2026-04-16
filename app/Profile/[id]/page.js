"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserContext } from "@/app/UserContext.js";

export default function ProfilePage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const { user } = useUserContext();

  const userEmail = user?.email;

  useEffect(() => {
    fetch("https://final-repository-production.up.railway.app/api/products/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: decodedId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([data]);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!products || products.length === 0) {
    return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1e2f, #2c3e50)",
        color: "white",
        padding: "20px",
      }}
    >
      {/* 👤 USER HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: "20px",
          padding: "15px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.05)",
          textAlign: "center",
          wordBreak: "break-word",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "clamp(20px, 4vw, 28px)" }}>
          {products[0]?.username || "No Name"}
        </h1>
        <p style={{ color: "#ccc", fontSize: "clamp(12px, 3vw, 14px)" }}>
          {products[0]?.email || "No Email"}
        </p>
      </motion.div>

      {/* 📦 PRODUCTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "15px",
        }}
      >
        {products.map((p, index) => {
          const isOld =
            p.createdAt &&
            new Date(p.createdAt) <
              new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

          return (
            <motion.div
              key={p.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.05)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              }}
            >
              {/* IMAGE */}
              <img
                src={p.imageUrl}
                onError={(e) => (e.target.src = "/fallback.jpg")}
                style={{
                  width: "100%",
                  height: "clamp(140px, 25vw, 180px)",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "10px" }}>
                <h3 style={{ fontSize: "clamp(16px, 3vw, 18px)" }}>
                  {p.name}
                </h3>

                <p
                  style={{
                    fontSize: "clamp(12px, 2.5vw, 13px)",
                    color: "#aaa",
                  }}
                >
                  {p.description}
                </p>

                <b style={{ color: "#00ffcc", fontSize: "14px" }}>
                  ₹{p.price}
                </b>

                {isOld && (
                  <div style={{ color: "orange", fontSize: "12px" }}>
                    ⏳ Expired
                  </div>
                )}

                {p.deleted && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    ❌ Deleted
                  </div>
                )}

                {/* 💬 COMMENTS */}
                <div style={{ marginTop: "10px" }}>
                  <h4 style={{ fontSize: "13px" }}>💬 Comments</h4>

                  {p.comments?.length > 0 ? (
                    p.comments.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#334155",
                          padding: "6px",
                          borderRadius: "6px",
                          marginBottom: "6px",
                          wordBreak: "break-word",
                        }}
                      >
                        <div style={{ fontSize: "13px" }}>
                          {c.message}
                        </div>

                        <div
                          onClick={() =>
                            router.push(
                              `/profile/${encodeURIComponent(c.email)}`
                            )
                          }
                          style={{
                            fontSize: "11px",
                            color: "#38bdf8",
                            cursor: "pointer",
                          }}
                        >
                          👤 {c.email}
                        </div>

                        {c.email === userEmail && (
                          <button
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "red",
                              fontSize: "10px",
                              cursor: "pointer",
                            }}
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "12px", color: "gray" }}>
                      No comments
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}