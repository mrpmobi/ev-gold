import React from "react";

export default function PoliticaDePrivacidadePage() {
  return (
    <div>
      <iframe
        src="/documents/politica-privacidade.pdf"
        width="100%"
        height="800px"
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
