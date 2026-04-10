"use client";

const NAMES = [
  "陈恺", "·", "Kai Chen", "·", "カイ・チェン", "·",
  "카이 천", "·", "Кай Чэнь", "·", "كاي تشين", "·",
  "काई चेन", "·", "ไค เฉิน", "·", "Κάι Τσεν", "·",
  "קאי צ׳ן", "·", "陳凱", "·",
];

function RibbonContent() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) =>
        NAMES.map((name, j) => (
          <span key={`${i}-${j}`} style={name === "·" ? { opacity: 0.4 } : {}}>
            {name}{" "}
          </span>
        ))
      )}
    </>
  );
}

export default function RightRibbon() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        right: "1rem",
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
          fontFamily: "'Nunito', 'Noto Sans', system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 300,
          letterSpacing: "0.2em",
          whiteSpace: "nowrap",
          animation: "ribbon-scroll 40s linear infinite reverse",
        }}
        className="ribbon-track text-black dark:text-white"
      >
        <RibbonContent />
        <RibbonContent />
      </div>
    </div>
  );
}
