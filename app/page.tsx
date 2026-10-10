"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [lang, setLang] = useState("English");
  const [speaking, setSpeaking] = useState(false);
  const [signMode, setSignMode] = useState(false);
  const [tutor, setTutor] = useState("");
  const [fontSize, setFontSize] = useState(22);

  const speak = () => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => v.lang.startsWith("en"));
    if (pick) u.voice = pick;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onboundary = (e) => {
      if (e.name === "word") {
        const spoken = text.slice(0, e.charIndex).split(" ").length;
        const words = text.split(" ");
        setResult(words.map((w, i) => i === spoken ? `[[${w}]]` : w).join(" "));
      }
    };
    window.speechSynthesis.speak(u);
    setSignMode(true);
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  const explain = () => {
    const map: any = {
      Hindi: `आइए इसे आसान भाषा में समझें: ${text.slice(0, 120)}...`,
      Tamil: `இதை எளிய மொழியில் பார்ப்போம்: ${text.slice(0, 120)}...`,
      Telugu: `దీన్ని సులభంగా చూద్దాం: ${text.slice(0, 120)}...`,
      English: `Let me explain simply: ${text.slice(0, 120)}...`,
    };
    setTutor(map[lang] || map.English);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FDF6E3", color: "#1B4332", padding: 24, fontFamily: "system-ui" }}>
      <header style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 44, color: "#2D6A4F", fontWeight: 800, margin: 0 }}>LearnAble</h1>
        <p style={{ marginTop: 6 }}>Every mind learns differently</p>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <label style={{ fontSize: 14 }}>Font: </label>
          <input type="range" min={16} max={36} value={fontSize} onChange={e => setFontSize(+e.target.value)} />
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: 6, borderRadius: 8 }}>
            <option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option>
          </select>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: "100%", height: 140, padding: 16, borderRadius: 16, border: "2px solid #2D6A4F", fontSize: 18 }}
          placeholder="Paste any text to learn..."
        />

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={speak} style={{ background: "#2D6A4F", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>🔊 Read Along</button>
          <button onClick={stop} style={{ background: "#999", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>⏹ Stop</button>
          <button onClick={explain} style={{ background: "#FFB703", color: "#1B4332", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>🧑‍🏫 Explain in {lang}</button>
          <button onClick={() => setSignMode(!signMode)} style={{ background: "#2D6A4F", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>🤟 Sign Language</button>
        </div>

        {signMode && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
            <div style={{ background: "white", padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize, lineHeight: 1.8 }}>
              {result.split(" ").map((w, i) => w.startsWith("[[") ? <mark key={i} style={{ background: "#FFB703", fontWeight: 700 }}>{w.replace(/\[\[|\]\]/g, "")} </mark> : w + " ")}
              {!result && <span style={{ color: "#888" }}>Click Read Along to hear and see...</span>}
            </div>
            <div style={{ background: "#2D6A4F", color: "white", padding: 20, borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: 60 }}>🤟</div>
              <p style={{ marginTop: 10 }}>Sign Language Interpreter</p>
              <p style={{ opacity: 0.7, fontSize: 14 }}>Signing: {result.split(" ").find(w => w.startsWith("[["))?.replace(/\[\[|\]\]/g, "") || "—"}</p>
            </div>
          </div>
        )}

        {tutor && (
          <div style={{ marginTop: 20, background: "white", padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: "#2D6A4F", margin: 0 }}>🧑‍🏫 AI Tutor ({lang})</h3>
            <p style={{ marginTop: 10, fontSize: 18 }}>{tutor}</p>
          </div>
        )}
      </div>

      <footer style={{ textAlign: "center", marginTop: 40, fontSize: 14, color: "#666" }}>
        Made by PixelPulse · Inclusive learning for everyone
      </footer>
    </main>
  );
}