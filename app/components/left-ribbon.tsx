"use client";

const REPEAT = 60;

function RibbonContent() {
  return (
    <>
      {Array.from({ length: REPEAT }).map((_, i) => (
        <span key={i}>
          Kai Chen · <span style={{ opacity: 0.4 }}>🔸</span> ·
        </span>
      ))}
    </>
  );
}

export default function LeftRibbon() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "1rem",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        userSelect: "none",
        display: "flex",
        alignItems: "flex-start",
      }}
      className="ribbon flex"
    >
      <div
        style={{
          writingMode: "vertical-lr",
          fontFamily: "'Nunito'",
          fontSize: 20,
          fontWeight: 300,
          letterSpacing: "0.2em",
          whiteSpace: "nowrap",
          animation: "ribbon-scroll 40s linear infinite",
        }}
        className="ribbon-track text-black dark:text-white"
      >
        <RibbonContent />
        <RibbonContent />
      </div>
    </div>
  );
}
