import React, { useState } from "react";
import { fetchOpenAICompletion } from "./openaiService";

/**
 * PUBLIC_INTERFACE
 * MotivationWidget
 * Button+area UI that fetches a motivational quote from OpenAI and displays it.
 */
function MotivationWidget() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Fetches a new motivational quote from OpenAI */
  const handleFetchQuote = async () => {
    setLoading(true);
    setError("");
    setQuote("");
    try {
      const result = await fetchOpenAICompletion(
        "Give me a 1-sentence motivational quote for staying productive."
      );
      setQuote(result.trim());
    } catch (err) {
      setError(
        err.message === "OpenAI API key is not set in environment variables"
          ? "OpenAI API key missing. Set REACT_APP_OPENAI_API_KEY in .env."
          : "Failed to contact OpenAI API."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#FFF",
        border: "1.5px solid #e9ecef",
        borderRadius: 12,
        padding: 20,
        margin: "28px auto 0 auto",
        maxWidth: 350,
        boxShadow: "0 2px 8px rgba(90,90,120,0.06)",
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 800, color: "#9395D3", fontSize: 17, marginBottom: 12 }}>
        AI Motivator
      </div>
      <button
        onClick={handleFetchQuote}
        disabled={loading}
        style={{
          background: "#1976D2",
          color: "#FFF",
          fontWeight: 600,
          fontSize: 15,
          border: "none",
          borderRadius: 8,
          padding: "9px 18px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.16s",
          boxShadow: "0 2px 6px rgba(140,130,190,0.08)",
        }}
      >
        {loading ? "Loading..." : "Get Motivation"}
      </button>
      {quote && (
        <div style={{ marginTop: 18, color: "#282c34", fontSize: 16, minHeight: 30, fontStyle: "italic" }}>
          “{quote}”
        </div>
      )}
      {error && (
        <div style={{ marginTop: 14, color: "#d42d2d", fontSize: 14 }}>{error}</div>
      )}
    </div>
  );
}

export default MotivationWidget;
