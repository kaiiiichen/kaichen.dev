"use client";
import { useEffect, useState } from "react";

export default function BerkeleyTime() {
  const [body, setBody] = useState("--:--:--");
  const [period, setPeriod] = useState("--");

  useEffect(() => {
    const update = () => {
      const full = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      // "09:30:45 AM"
      const [time, p] = full.split(" ");
      setBody(time ?? "--:--:--");
      setPeriod(p ?? "--");
    };
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{body}</span>
      <span style={{ display: "inline-block", width: "2.2em", textAlign: "left", paddingLeft: "0.3em" }}>{period}</span>
    </>
  );
}
