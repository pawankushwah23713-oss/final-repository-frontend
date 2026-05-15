"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useUserContext } from "../UserContext.js";

export default function AddProductForm() {
  const { user, flag } = useUserContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: user?.password || "",
    email: user?.email || "",
    name: "",
    description: "",
    price: "",
    sku: "",
    category: "",
    imageUrl: "",
  });

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const f = files[0];
      if (f) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    try {
      setLoading(true);

      const uploadForm = new FormData();
      uploadForm.append("image", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      const res = await fetch("https://final-repository-3.onrender.com/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      const data = await res.json();

      setFormData({
        username: user?.username || "",
        password: user?.password || "",
        email: user?.email || "",
        name: "",
        description: "",
        price: "",
        sku: "",
        category: "",
        imageUrl: "",
      });

      setFile(null);
      setPreview(null);

      alert("Product Added: " + data.name);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {flag ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md sm:max-w-lg md:max-w-xl p-5 sm:p-6 md:p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
              Add Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* INPUTS */}
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-500 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-500 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-500 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />

              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-500 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-500 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />

              {/* FILE INPUT */}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 text-gray-700 bg-white border border-gray-400 rounded-lg cursor-pointer"
                required
              />

              {/* PREVIEW */}
              {preview && (
                <motion.img
                  src={preview}
                  alt="preview"
                  className="w-full h-44 object-cover rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}

              {/* BUTTON */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg flex justify-center items-center hover:bg-purple-700 transition"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Uploading...
                  </span>
                ) : (
                  "Add Product"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-center max-w-md w-full"
          >
            <div className="text-6xl mb-4">🔒</div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Access Restricted
            </h2>

            <p className="text-white/80 mb-6">
              You need to login to view products.
            </p>

            <button
              onClick={() => router.push("/form")}
              className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-xl hover:scale-105 transition"
            >
              Login Now
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
