"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupUser } from "../../../utils/api"; // You'll need to create this API function

export default function SignupPage() {
  const [accountType, setAccountType] = useState("User");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    totalMonthlyBudget: "",
  });

  const handleOnChange = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await signupUser({ ...formData, accountType });
      setSuccess("Signup successful! You can now log in.");
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error("Signup error:", err);
    }
  };

  const tabData = [
    {
      id: 1,
      tabName: "Admin",
      type: "Admin",
    },
    {
      id: 2,
      tabName: "User",
      type: "User",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-6 bg-gradient-to-br from-[#0d192b] via-[#1e2a47] to-[#3d65ff] pb-4 sm:pb-7">
      <div className="p-6 mx-4 bg-white/90 gap-2 max-w-xl mt-4 rounded-3xl shadow-2xl border border-[#3d65ff]/20">
        <h1 className="text-2xl sm:text-4xl font-bold p-2 text-[#3d65ff] text-center">
          Sign Up
        </h1>

        <div
          style={{ boxShadow: "inset 0px -1px 0px rgba(61, 101, 255, 0.18)" }}
          className="flex flex-col sm:flex-row bg-[#eaf0ff] p-1 gap-1 my-6 rounded-full w-full"
        >
          {tabData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAccountType(tab.type)}

              // FIX: Remove the space between $ and { in the template string
              // The correct syntax is `${...}`
              // So, let's fix it:
              className={`${
                accountType === tab.type
                  ? "bg-[#3d65ff] text-white shadow-md"
                  : "bg-[#eaf0ff] text-[#3d65ff] border border-[#3d65ff]"
              } py-2 px-5 rounded-full transition-all duration-200 font-medium sm:mr-8 cursor-pointer`}
            >
              {tab?.tabName}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="font-semibold text-sm sm:text-base flex flex-col gap-4 p-1"
        >
          <div className="flex flex-col sm:flex-row gap-4 ">
            <label className="flex-1">
              <p className="mb-1 text-[#1e2a47]">Name</p>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-2 rounded-md shadow-md border border-[#3d65ff]/30 focus:border-[#3d65ff] focus:outline-none text-[#1e2a47] placeholder:text-[#3d65ff]/60"
              ></input>
            </label>
          </div>

          <div className="">
            <label>
              <p className="mb-1 text-[#1e2a47]">Email Address</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-2 rounded-md shadow-md border border-[#3d65ff]/30 focus:border-[#3d65ff] focus:outline-none text-[#1e2a47] placeholder:text-[#3d65ff]/60"
              ></input>
            </label>
          </div>

          <div>
            <label>
              <p className="mb-1 text-[#1e2a47]">Monthly Budget (₹)</p>
              <input
                type="number"
                name="totalMonthlyBudget"
                value={formData.totalMonthlyBudget}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-2 rounded-md shadow-md border border-[#3d65ff]/30 focus:border-[#3d65ff] focus:outline-none text-[#1e2a47] placeholder:text-[#3d65ff]/60"
              ></input>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 ">
            <label className="flex-1">
              <p className="mb-1 text-[#1e2a47]">Create Password</p>
              <input
                type="password"
                name="password"
                value={formData.password}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-2 rounded-md shadow-md border border-[#3d65ff]/30 focus:border-[#3d65ff] focus:outline-none text-[#1e2a47] placeholder:text-[#3d65ff]/60"
              ></input>
            </label>
            <label className="flex-1">
              <p className="mb-1 text-[#1e2a47]">Confirm Password</p>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-2 rounded-md shadow-md border border-[#3d65ff]/30 focus:border-[#3d65ff] focus:outline-none text-[#1e2a47] placeholder:text-[#3d65ff]/60"
              ></input>
            </label>
          </div>

          <button
            type="submit"
            className="bg-[#3d65ff] rounded-full text-white font-medium text-lg px-6 py-3 cursor-pointer hover:-translate-y-1 hover:bg-[#2746b6] ease-linear duration-200 mt-4 shadow-lg"
          >
            Create Account
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
