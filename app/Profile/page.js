"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "../UserContext.js";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { user, flag } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    fetch("https://final-repository-production.up.railway.app/api/products/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (productId) => {
    fetch(`https://final-repository-production.up.railway.app/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete product");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Deleted:", data);
        setProducts(products.filter((p) => p.id !== productId));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete product");
      });
  };

  return (
    <div>
      {flag ? (
        <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-4 sm:px-6 md:px-10 py-6">
          
          {/* ✅ Responsive Heading */}
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
            🛍️ Your Products
          </h1>

          {products.length === 0 ? (
            <p className="text-center text-white text-base sm:text-lg">
              Loading...
            </p>
          ) : (
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden relative flex flex-col"
                >
                  {/* ✅ Responsive Image */}
                  <img
                    src={p.imageUrl}
                    className="w-full h-40 sm:h-44 md:h-48 object-cover"
                  />

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
                      {p.name}
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">
                      {p.description}
                    </p>

                    <p className="text-blue-600 font-bold mt-2 text-sm sm:text-base">
                      ₹ {p.price}
                    </p>

                    <span className="inline-block mt-2 text-xs bg-gray-200 px-3 py-1 rounded-full w-fit">
                      {p.category}
                    </span>

                    {/* Spacer for better layout */}
                    <div className="flex-grow"></div>
                  </div>

                  {/* ✅ Responsive Delete Button */}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="absolute top-2 right-2 text-xs sm:text-sm bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          
          {/* ✅ Responsive Auth Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 text-center max-w-md w-full"
          >
            <div className="text-5xl sm:text-6xl mb-4">🔒</div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Access Restricted
            </h2>

            <p className="text-white/80 text-sm sm:text-base mb-6">
              You need to login to view products and interact with them.
            </p>

            <button
              onClick={() => router.push("/form")}
              className="bg-white text-purple-600 font-semibold py-2 px-5 sm:px-6 rounded-xl hover:scale-105 hover:bg-purple-100 transition"
            >
              Login Now
            </button>

            <p className="text-white/60 mt-4 text-xs sm:text-sm">
              Don’t have an account? Sign up in seconds 🚀
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}