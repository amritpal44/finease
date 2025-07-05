"use client";

import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";
import { useSuggestionToasts } from "../hooks/useSuggestionToasts";

function SuggestionToastsAndChildren({ children }) {
  const { token } = useAuth();
  const apiKey = "my-suggestion-api-key";
  useSuggestionToasts(token, apiKey);
  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-4">{children}</main>
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ minWidth: 400, maxWidth: 520 }}
      />
    </>
  );
}

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <SuggestionToastsAndChildren>{children}</SuggestionToastsAndChildren>
    </AuthProvider>
  );
}
