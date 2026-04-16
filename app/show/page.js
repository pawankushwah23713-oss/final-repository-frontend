"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ✅ FETCH DATA (background me store karenge)
  useEffect(() => {
    fetch("https://final-repository-production.up.railway.app/api/products/all")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ FILTER (NAME + EMAIL + SKU)
  const filteredProducts = products.filter((p) =>
    (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div style={{ width: "400px", position: "relative" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🔍 Search Users
        </h2>

        {/* 🔍 INPUT */}
        <input
          type="text"
          placeholder="Search by name, email, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />

        {/* 🔥 DROPDOWN */}
        {search && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              width: "100%",
              background: "#1e293b",
              borderRadius: "8px",
              maxHeight: "250px",
              overflowY: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              zIndex: 100,
            }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    router.push(`/Profile/${p.email}`);
                    setSearch("");
                  }}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #334155",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{p.name}</div>
                  <small style={{ color: "#38bdf8" }}>{p.email}</small>
                </div>
              ))
            ) : (
              <div style={{ padding: "10px", color: "gray" }}>
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}