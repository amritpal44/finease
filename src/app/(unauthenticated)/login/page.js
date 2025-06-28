"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../../../utils/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser({ email, password });
      login(data.token); // Assuming your API returns a 'token' field
      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-6 bg-gradient-to-br from-[#0d192b] via-[#1e2a47] to-[#3d65ff] pb-4 sm:pb-7">
      <div className="p-6 mx-4 bg-white/90 gap-2 w-full max-w-xl mt-4 rounded-3xl shadow-2xl border border-[#3d65ff]/20">
        <h1 className="text-2xl sm:text-4xl font-bold p-2 text-[#3d65ff] text-center">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="font-semibold text-sm sm:text-base flex flex-col gap-4 p-1"
        >
          <div className="flex flex-col gap-4">
            <label className="flex-1">
              <p className="mb-1 text-[#1e2a47]">Email Address</p>
              <input
                type="email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md shadow-md border border-[#3d65ff]/30 focus:border-[#3d65ff] focus:outline-none text-[#1e2a47] placeholder:text-[#3d65ff]/60"
              />
            </label>
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex-1">
              <p className="mb-1 text-[#1e2a47]">Password</p>
              <input
                type="password"
                name="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md shadow-md border border-[#3d65ff]/30 focus:border-[#3d65ff] focus:outline-none text-[#1e2a47] placeholder:text-[#3d65ff]/60"
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-[#3d65ff] rounded-full text-white font-medium text-lg px-6 py-3 cursor-pointer hover:-translate-y-1 hover:bg-[#2746b6] ease-linear duration-200 mt-4 shadow-lg"
          >
            Sign In
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-center mt-4">
          <Link
            href="/signup"
            className="text-[#3d65ff] hover:underline text-sm font-semibold"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
