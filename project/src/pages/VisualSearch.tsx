import React from "react";
import VisualSearch from "../components/VisualSearch";
// TypeScript will prioritize .tsx over .jsx automatically

export default function VisualSearchPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #0a1026 0%, #23263b 60%, #f6f3ee 100%)", // luxury fashion palette
        padding: "2rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <VisualSearch />
    </div>
  );
}
