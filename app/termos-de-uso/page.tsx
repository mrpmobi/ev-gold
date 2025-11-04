import React from "react";

export default function TermosDeUsoPage() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      boxSizing: "border-box"
    }}>
      <iframe
        src="/documents/termos-uso.pdf"
        width="100%"
        height="100%"
        style={{
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
        title="Documento PDF"
      />
    </div>
  );
}