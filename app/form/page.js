"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { useUserContext } from "../UserContext.js";
import { auth, googleProvider, githubProvider } from "../lib/firebase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser, flag, setFlag } = useUserContext();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://final-repository-production.up.railway.app/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid credentials 🚫");
        setFlag(false);
        setLoading(false);
        return;
      }

      setUser({
        username: data.name,
        email: data.email,
        password: data.password,
      });

      setFlag(true);

      setTimeout(() => {
        setLoading(false);
        router.push("/");
      }, 4000);
    } catch (err) {
      alert("Login failed 🚫");
      setFlag(false);
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://final-repository-production.up.railway.app/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed 🚫");
        setFlag(false);
        setLoading(false);
        return;
      }

      setUser({
        username: data.name,
        email: data.email,
        password: data.password,
      });

      setFlag(true);

      setTimeout(() => {
        setLoading(false);
        router.push("/");
      }, 4000);
    } catch (err) {
      alert("Email already exists 🚫");
      setFlag(false);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const payload = {
        name: result.user.displayName,
        email: result.user.email,
        password: "",
        provider: "google",
      };

      const url = isLogin
        ? "https://final-repository-production.up.railway.app/api/users/login"
        : "https://final-repository-production.up.railway.app/api/users";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Google auth failed 🚫");
        setFlag(false);
        setLoading(false);
        return;
      }

      setUser({
        username: result.user.displayName,
        email: result.user.email,
        password: "",
      });

      setFlag(true);

      setTimeout(() => {
        setLoading(false);
        router.push("/");
      }, 4000);
    } catch (err) {
      alert("Error: " + err.message);
      setFlag(false);
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);

      const payload = {
        name: result.user.displayName || "GitHub User",
        email: result.user.email,
        password: "",
        provider: "github",
      };

      const url = isLogin
        ? "https://shopingbackend-production.up.railway.app/api/users/login"
        : "https://shopingbackend-production.up.railway.app/api/users";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "GitHub auth failed 🚫");
        setFlag(false);
        setLoading(false);
        return;
      }

      setUser({
        username: result.user.displayName || "GitHub User",
        email: result.user.email,
        password: "",
      });

      setFlag(true);

      setTimeout(() => {
        setLoading(false);
        router.push("/");
      }, 4000);
    } catch (err) {
      alert("Error: " + err.message);
      setFlag(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("User Updated:", user);
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-base sm:text-lg font-semibold text-center">
            {isLogin ? "Logging you in..." : "Creating account..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-purple-900 to-blue-900 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      <div className="w-full max-w-sm sm:max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-6 text-white">

        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-6">
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-2.5 sm:p-3 text-sm sm:text-base bg-white/20 border border-white/30 rounded-lg placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-2.5 sm:p-3 text-sm sm:text-base bg-white/20 border border-white/30 rounded-lg placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2.5 sm:p-3 text-sm sm:text-base bg-white/20 border border-white/30 rounded-lg placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {isLogin ? (
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-transform text-white py-2 text-sm sm:text-base rounded-lg mb-4 shadow-lg"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transition-transform text-white py-2 text-sm sm:text-base rounded-lg mb-4 shadow-lg"
            >
              Sign Up
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleGoogle}
              className="flex-1 bg-white/20 hover:bg-white/30 transition py-2 text-sm sm:text-base rounded-lg border border-white/30"
            >
              Google
            </button>

            <button
              onClick={handleGithub}
              className="flex-1 bg-white/20 hover:bg-white/30 transition py-2 text-sm sm:text-base rounded-lg border border-white/30"
            >
              GitHub
            </button>
          </div>

          <p className="text-center mt-4 text-xs sm:text-sm text-gray-200">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-300 ml-1 cursor-pointer hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}