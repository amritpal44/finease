"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage (or cookies if you use cookies)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          // Token expired
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (e) {
        // Invalid token format
        localStorage.removeItem("token");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {" "}
      {/* Adjust height based on navbar height */}
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Personal Finance Tracker+
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Take control of your spending and achieve your financial goals.
      </p>
      <div className="flex flex-col md:flex-row gap-5 justify-around pt-10 text-[18px] font-bold w-full max-w-lg">
        <Link
          href="/dashboard"
          className="flex-1 bg-gradient-to-r from-[#3d65ff] to-[#2746b6] hover:from-[#2746b6] hover:to-[#3d65ff] text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-200 text-center border-2 border-[#3d65ff]/30 hover:scale-105"
        >
          Go to Dashboard
        </Link>
      </div>
      {/* You might want to add login/signup buttons here later */}
    </div>
  );
}
