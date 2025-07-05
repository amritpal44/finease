"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const SUGGESTION_API_URL =
  "https://finease-suggestion-api.onrender.com/suggestions";

export function useSuggestionToasts(token, apiKey) {
  const intervalRef = useRef();
  const storageKey = token ? `suggestionToasts:${token}` : null;

  // Helper to clear and set new suggestion object in localStorage
  const storeSuggestions = (suggestions) => {
    if (!storageKey) return;
    localStorage.removeItem(storageKey);
    localStorage.setItem(
      storageKey,
      JSON.stringify({ data: suggestions, index: 0 })
    );
  };

  // Fetch and store new suggestions
  const fetchAndStoreSuggestions = async () => {
    if (!token || !apiKey) return;
    try {
      const res = await fetch(`${SUGGESTION_API_URL}?token=${token}`, {
        headers: { "x-api-key": apiKey },
      });
      const data = await res.json();
      if (Array.isArray(data.suggestions)) {
        storeSuggestions(data.suggestions);
      }
    } catch (err) {
      // Optionally show a toast for fetch error
    }
  };

  // Show the toast for the current index
  const showCurrentToast = () => {
    if (!storageKey) return;
    const obj = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!obj || !Array.isArray(obj.data) || typeof obj.index !== "number")
      return;
    if (obj.index >= obj.data.length) {
      // All shown, clear and fetch new
      localStorage.removeItem(storageKey);
      fetchAndStoreSuggestions();
      return;
    }
    const sug = obj.data[obj.index];
    let toastFn = toast.info;
    if (sug.type === "error") toastFn = toast.error;
    else if (sug.type === "warning") toastFn = toast.warn;
    toastFn(
      <div>
        <strong>{sug.title}</strong>
        <div>{sug.details}</div>
      </div>,
      { autoClose: 10000 }
    );
    // Increment index and store
    localStorage.setItem(
      storageKey,
      JSON.stringify({ data: obj.data, index: obj.index + 1 })
    );
  };

  // On login/token change, fetch and store new suggestions
  useEffect(() => {
    if (!token || !apiKey) return;
    fetchAndStoreSuggestions();
    // eslint-disable-next-line
  }, [token, apiKey]);

  // Forever interval: every 10s, show toast for current index if data present
  useEffect(() => {
    if (!storageKey) return;
    intervalRef.current = setInterval(() => {
      showCurrentToast();
    }, 10 * 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [storageKey]);

  return {};
}
