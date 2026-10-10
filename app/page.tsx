"use client";
import { useState, useRef, useEffect } from "react";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "bn", label: "Bengali" },
];

const TUTOR_REPLIES: Record<string, string> = {
  en: "Let me explain this simply. The main idea is: ",
  hi: "आइए इसे आसान भाषा में समझें। मुख्य विचार है: ",
  ta: "இதை எளிய மொழியில் பார்ப்போம். முக்கிய கருத்து: ",
  te: "దీన్ని సులభంగా చూద్దాం. ప్రధాన ఆలోచన: ",
  bn: "চলুন সহজ ভাষায় বুঝি। মূল বিষয় হল: ",
};

const STOPWORDS = ["the","is","are","a","an","of","to","and","in","on","for","with","by","as","at","it","this","that","be","or","from","which","was","were","has","have","had"];

export default function Home() {
  const [text, setText] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lang, setLang] = useState("en");
  const [rate, setRate] = useState(0.9);
  const [fontSize, setFontSize] = useState(22);
  const [contrast, setContrast] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [tutor, setTutor] = useState("");
  const [signMode, setSignMode] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  const extractKeywords = (t: string) => {
    const cleaned = t.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    const freq: Record<string, number> = {};
    cleaned.forEach(w => {
      if (w.length > 4 && !STOPWORDS.includes(w)) freq[w] = (freq[w] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
  };

  const speak = () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const w = text.split(/\s+/).filter(Boolean);
    setWords(w);
    setKeywords(extractKeywords(text));
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => v.lang.toLowerCase().startsWith(lang));
    if (pick) u.voice = pick;
    u.onstart = () => { setSpeaking(true); setPaused(false); };
    u.onend = () => { setSpeaking(false); setCurrentIdx(-1); };
    u.onboundary = (e) => {
      if (e.name === "word") {
        const idx = text.slice(0, e.charIndex).trim().split(/\s+/).length - 1;
        setCurrentIdx(idx);
        if (idx >= 0 && w[idx]) setTranscript(prev => [...prev.slice(-40), w[idx]]);
      }
    };
    window.speechSynthesis.speak(u);
  };

  const pauseResume = () => {
    if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPaused(false); }
    else { window.speechSynthesis.pause(); setPaused(true); }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false); setPaused(false); setCurrentIdx(-1);
  };

  const explain = () => {
    if (!text.trim()) return;
    setTutor(TUTOR_REPLIES[lang] + text.slice(0, 160) + "...");
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript.join(" ")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "learnable-transcript.txt"; a.click();
  };

  const bg = contrast ? "#000" : "#FDF6E3";
  const fg = contrast ? "#FFF" : "#1B4332";
  const cardBg = contrast ? "#111" : "#FFF";
  const headingFont = dyslexia ? "Comic Sans MS, Verdana, sans-serif" : "system-ui, sans-serif";
  const spacing = dyslexia ? "0.06em" : "normal";
  const lh = dyslexia ? 2 : 1.6;

  return (
    <main style={{ minHeight: "100vh", background: bg, color: fg, padding: 24, fontFamily: headingFont, letterSpacing: spacing, lineHeight: lh }}>
      <header style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 46, color: contrast ? "#FFB703" : "#2D6A4F", fontWeight: 900, margin: 0 }}>LearnAble</h1>
        <p style={{ marginTop: 6, opacity: 0.85 }}>Every mind learns differently</p>
      </header>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", background: cardBg, padding: 12, borderRadius: 14, marginBottom: 16, alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Font {fontSize}px</span>
          <input type="range" min={16} max={40} value={fontSize} onChange={e => setFontSize(+e.target.value)} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Speed {rate.toFixed(1)}x</span>
          <input type="range" min={0.5} max={1.5} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} />
          <button onClick={() => setContrast(!contrast)} style={{ padding: "8px 12px", borderRadius: 10, border: 0, cursor: "pointer", background: contrast ? "#FFB703" : "#eee", color: "#111", fontWeight: 600 }}>High Contrast</button>
          <button onClick={() => setDyslexia(!dyslexia)} style={{ padding: "8px 12px", borderRadius: 10, border: 0, cursor: "pointer", background: dyslexia ? "#FFB703" : "#eee", color: "#111", fontWeight: 600 }}>Dyslexia Mode</button>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: "100%", height: 130, padding: 16, borderRadius: 16, border: "2px solid #2D6A4F", fontSize: 18, fontFamily: "inherit", background: cardBg, color: fg }}
          placeholder="Paste any text to learn..."
        />

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={speak} style={{ background: "#2D6A4F", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>🔊 Read Along</button>
          <button onClick={pauseResume} disabled={!speaking} style={{ background: "#555", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer", opacity: speaking ? 1 : 0.5 }}>{paused ? "▶ Resume" : "⏸ Pause"}</button>
          <button onClick={stop} style={{ background: "#999", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>⏹ Stop</button>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: 12, borderRadius: 12, border: "2px solid #2D6A4F", fontWeight: 600, background: cardBg, color: fg }}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <button onClick={explain} style={{ background: "#FFB703", color: "#1B4332", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>🧑‍🏫 Explain</button>
          <button onClick={() => setSignMode(!signMode)} style={{ background: "#2D6A4F", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>🤟 Sign Language</button>
        </div>

        {keywords.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>🔑 Key words:</span>
            {keywords.map((k, i) => (
              <span key={i} style={{ background: "#FFB703", color: "#1B4332", padding: "4px 12px", borderRadius: 20, fontSize: 14, fontWeight: 600 }}>{k}</span>
            ))}
          </div>
        )}

        {signMode ? (
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginTop: 20 }}>
            <div style={{ background: cardBg, padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize, lineHeight: 1.9 }}>
              {words.length === 0 && <span style={{ color: "#888" }}>Click Read Along to hear and see...</span>}
              {words.map((w, i) => (
                <span key={i} style={{ background: i === currentIdx ? "#FFB703" : "transparent", fontWeight: i === currentIdx ? 800 : 400, padding: i === currentIdx ? "2px 4px" : 0, borderRadius: 4 }}>{w} </span>
              ))}
            </div>
            <div style={{ background: "#2D6A4F", color: "white", padding: 24, borderRadius: 16, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <div style={{ fontSize: 72 }}>🤟</div>
              <p style={{ marginTop: 8, fontWeight: 700 }}>Sign Language Interpreter</p>
              <p style={{ opacity: 0.85, fontSize: 15 }}>Signing: <b>{currentIdx >= 0 && words[currentIdx] ? words[currentIdx] : "—"}</b></p>
              {transcript.length > 0 && (
                <button onClick={downloadTranscript} style={{ marginTop: 12, background: "#FFB703", color: "#1B4332", border: 0, padding: "8px 14px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>⬇ Save Transcript</button>
              )}
            </div>
          </div>
        ) : (
          words.length > 0 && (
            <div style={{ marginTop: 20, background: cardBg, padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize, lineHeight: 1.9 }}>
              {words.map((w, i) => (
                <span key={i} style={{ background: i === currentIdx ? "#FFB703" : "transparent", fontWeight: i === currentIdx ? 800 : 400, padding: i === currentIdx ? "2px 4px" : 0, borderRadius: 4 }}>{w} </span>
              ))}
            </div>
          )
        )}

        {tutor && (
          <div style={{ marginTop: 20, background: cardBg, padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: "#2D6A4F", margin: 0 }}>🧑‍🏫 AI Tutor ({LANGS.find(l => l.code === lang)?.label})</h3>
            <p style={{ marginTop: 10, fontSize: 18 }}>{tutor}</p>
          </div>
        )}

      </div>

      <footer style={{ textAlign: "center", marginTop: 40, fontSize: 14, opacity: 0.7 }}>
        Made by PixelPulse · Inclusive learning for everyone
      </footer>
    </main>
  );
}