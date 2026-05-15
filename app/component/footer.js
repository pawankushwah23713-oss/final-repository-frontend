"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-black text-gray-300 mt-auto">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        
        {/* Logo / About */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">MyApp</h2>
          <p className="text-sm">
            Best platform to explore and add amazing products. Fast, simple and modern.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li onClick={() => router.push("/")} className="cursor-pointer hover:text-white">Home</li>
            <li onClick={() => router.push("/form")} className="cursor-pointer hover:text-white">Login</li>
            <li onClick={() => router.push("/Profile")} className="cursor-pointer hover:text-white">Profile</li>
            <li onClick={() => router.push("/Add")} className="cursor-pointer hover:text-white">Add Product</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-sm">
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">LinkedIn</span>
            <span className="hover:text-white cursor-pointer">GitHub</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </footer>
  );
}
