"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const SUGGESTION_API_URL =
  "https://finease-suggestion-api.onrender.com/suggestions";

export function useSuggestionToasts(token, apiKey) {
  const [suggestions, setSuggestions] = useState([]);
  const [lastShown, setLastShown] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const intervalRef = useRef();
  const storageKey = token ? `suggestionLastShown:${token}` : null;

  // Fetch suggestions from API
  const fetchSuggestions = async () => {
    if (!token || !apiKey) return;
    try {
      const res = await fetch(`${SUGGESTION_API_URL}?token=${token}`, {
        headers: { "x-api-key": apiKey },
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setCurrentIdx(0);
      setLastShown({});
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify({}));
      }
    } catch (err) {
      // Optionally show a toast for fetch error
    }
  };

  // Show the next suggestion as a toast
  const showNextToast = () => {
    if (suggestions.length === 0) return;
    let shown = { ...lastShown };
    let idx = 0;
    // Find the first suggestion not shown
    while (idx < suggestions.length && shown[idx]) {
      idx++;
    }
    if (idx >= suggestions.length) {
      // All shown, fetch new suggestions
      fetchSuggestions();
      return;
    }
    const sug = suggestions[idx];
    let toastFn = toast.info;
    if (sug.type === "error") toastFn = toast.error;
    else if (sug.type === "warning") toastFn = toast.warn;
    toastFn(
      <>
        <strong>{sug.title}</strong>
        <div>{sug.details}</div>
      </>,
      { autoClose: 10000 }
    );
    shown[idx] = Date.now();
    setLastShown(shown);
    setCurrentIdx(idx + 1);
    // Persist to localStorage
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(shown));
    }
  };

  useEffect(() => {
    if (!token || !apiKey) return;
    // Load shown state from localStorage
    let loaded = {};
    if (storageKey) {
      try {
        loaded = JSON.parse(localStorage.getItem(storageKey)) || {};
      } catch {
        loaded = {};
      }
    }
    setLastShown(loaded);
    fetchSuggestions();
    intervalRef.current = setInterval(showNextToast, 10 * 60 * 1000); // 10 min
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [token, apiKey]);

  useEffect(() => {
    if (suggestions.length > 0) {
      // Find the first unshown suggestion
      let idx = 0;
      while (idx < suggestions.length && lastShown[idx]) {
        idx++;
      }
      setCurrentIdx(idx);
      if (idx < suggestions.length) {
        showNextToast();
      }
    }
    // eslint-disable-next-line
  }, [suggestions, lastShown]);

  return { suggestions, lastShown, fetchSuggestions, showNextToast };
}
