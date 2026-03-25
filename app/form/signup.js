import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="w-[350px] bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="text-center mt-4 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 ml-1 cursor-pointer font-semibold"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
