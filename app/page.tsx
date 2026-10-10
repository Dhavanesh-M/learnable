"use client";
import { useState, useEffect } from "react";

const LANGS = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

const UI: Record<string, Record<string, string>> = {
  en: { tagline: "Every mind learns differently", placeholder: "Paste any text to learn...", read: "🔊 Read Along", pause: "⏸ Pause", resume: "▶ Resume", stop: "⏹ Stop", explain: "🧑‍🏫 Explain", sign: "🤟 Sign Language", keyWords: "🔑 Key words:", interpreter: "Sign Language Interpreter", signing: "Signing:", save: "⬇ Save Transcript", clickRead: "Click Read Along to hear and see...", font: "Font", speed: "Speed", contrast: "High Contrast", dyslexia: "Dyslexia Mode", tutorLabel: "AI Tutor", footer: "Made by PixelPulse · Inclusive learning for everyone" },
  hi: { tagline: "हर मन अलग तरह से सीखता है", placeholder: "सीखने के लिए कोई भी टेक्स्ट यहाँ डालें...", read: "🔊 साथ पढ़ें", pause: "⏸ रोकें", resume: "▶ जारी रखें", stop: "⏹ बंद करें", explain: "🧑‍🏫 समझाएँ", sign: "🤟 सांकेतिक भाषा", keyWords: "🔑 मुख्य शब्द:", interpreter: "सांकेतिक भाषा दुभाषिया", signing: "इशारा:", save: "⬇ ट्रांसक्रिप्ट सहेजें", clickRead: "सुनने और देखने के लिए 'साथ पढ़ें' दबाएँ...", font: "फ़ॉन्ट", speed: "गति", contrast: "उच्च कंट्रास्ट", dyslexia: "डिस्लेक्सिया मोड", tutorLabel: "एआई शिक्षक", footer: "PixelPulse द्वारा · सबके लिए समावेशी शिक्षा" },
  ta: { tagline: "ஒவ்வொரு மனமும் வித்தியாசமாக கற்கிறது", placeholder: "கற்க எந்த உரையையும் இங்கே ஒட்டவும்...", read: "🔊 சேர்ந்து படி", pause: "⏸ இடைநிறுத்து", resume: "▶ தொடர்", stop: "⏹ நிறுத்து", explain: "🧑‍🏫 விளக்கு", sign: "🤟 சைகை மொழி", keyWords: "🔑 முக்கிய சொற்கள்:", interpreter: "சைகை மொழி மொழிபெயர்ப்பாளர்", signing: "சைகை:", save: "⬇ உரையை சேமி", clickRead: "கேட்கவும் பார்க்கவும் 'சேர்ந்து படி' அழுத்தவும்...", font: "எழுத்துரு", speed: "வேகம்", contrast: "அதிக மாறுபாடு", dyslexia: "டிஸ்லெக்சியா பயன்முறை", tutorLabel: "AI ஆசிரியர்", footer: "PixelPulse · அனைவருக்கும் உள்ளடக்கிய கல்வி" },
  te: { tagline: "ప్రతి మనసు వేరుగా నేర్చుకుంటుంది", placeholder: "నేర్చుకోవడానికి ఏదైనా వచనాన్ని ఇక్కడ పేస్ట్ చేయండి...", read: "🔊 కలిసి చదువు", pause: "⏸ విరామం", resume: "▶ కొనసాగించు", stop: "⏹ ఆపు", explain: "🧑‍🏫 వివరించు", sign: "🤟 సంజ్ఞ భాష", keyWords: "🔑 ముఖ్య పదాలు:", interpreter: "సంజ్ఞ భాషా దుబాసీ", signing: "సంజ్ఞ:", save: "⬇ ట్రాన్స్క్రిప్ట్ సేవ్", clickRead: "వినడానికి, చూడటానికి 'కలిసి చదువు' నొక్కండి...", font: "ఫాంట్", speed: "వేగం", contrast: "అధిక కాంట్రాస్ట్", dyslexia: "డిస్లెక్సియా మోడ్", tutorLabel: "AI ట్యూటర్", footer: "PixelPulse · అందరికీ సమగ్ర విద్య" },
  bn: { tagline: "প্রতিটি মন আলাদাভাবে শেখে", placeholder: "শিখতে যেকোনো টেক্সট এখানে পেস্ট করুন...", read: "🔊 সাথে পড়ুন", pause: "⏸ বিরতি", resume: "▶ চালু", stop: "⏹ থামুন", explain: "🧑‍🏫 ব্যাখ্যা", sign: "🤟 সাংকেতিক ভাষা", keyWords: "🔑 মূল শব্দ:", interpreter: "সাংকেতিক ভাষা দোভাষী", signing: "সংকেত:", save: "⬇ ট্রান্সক্রিপ্ট সংরক্ষণ", clickRead: "শুনতে ও দেখতে 'সাথে পড়ুন' চাপুন...", font: "ফন্ট", speed: "গতি", contrast: "উচ্চ কনট্রাস্ট", dyslexia: "ডিস্লেক্সিয়া মোড", tutorLabel: "AI শিক্ষক", footer: "PixelPulse · সবার জন্য অন্তর্ভুক্তিমূলক শিক্ষা" },
  mr: { tagline: "प्रत्येक मन वेगळ्या पद्धतीने शिकतो", placeholder: "शिकण्यासाठी कोणताही मजकूर येथे पेस्ट करा...", read: "🔊 सोबत वाचा", pause: "⏸ थांबवा", resume: "▶ सुरू", stop: "⏹ बंद", explain: "🧑‍🏫 समजावून सांगा", sign: "🤟 सांकेतिक भाषा", keyWords: "🔑 मुख्य शब्द:", interpreter: "सांकेतिक भाषा दुभाषी", signing: "संकेत:", save: "⬇ ट्रान्स्क्रिप्ट जतन करा", clickRead: "ऐकण्यासाठी व पाहण्यासाठी 'सोबत वाचा' दाबा...", font: "फॉन्ट", speed: "वेग", contrast: "उच्च कॉन्ट्रास्ट", dyslexia: "डिस्लेक्सिया मोड", tutorLabel: "AI शिक्षक", footer: "PixelPulse · सर्वांसाठी समावेशक शिक्षण" },
  kn: { tagline: "ಪ್ರತಿ ಮನಸ್ಸು ವಿಭಿನ್ನವಾಗಿ ಕಲಿಯುತ್ತದೆ", placeholder: "ಕಲಿಯಲು ಯಾವುದೇ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...", read: "🔊 ಜೊತೆಗೆ ಓದಿ", pause: "⏸ ವಿರಾಮ", resume: "▶ ಮುಂದುವರಿಸಿ", stop: "⏹ ನಿಲ್ಲಿಸಿ", explain: "🧑‍🏫 ವಿವರಿಸಿ", sign: "🤟 ಸನ್ನೆ ಭಾಷೆ", keyWords: "🔑 ಪ್ರಮುಖ ಪದಗಳು:", interpreter: "ಸನ್ನೆ ಭಾಷಾ ದುಭಾಷಿ", signing: "ಸನ್ನೆ:", save: "⬇ ಟ್ರಾನ್ಸ್ಕ್ರಿಪ್ಟ್ ಉಳಿಸಿ", clickRead: "ಕೇಳಲು ಮತ್ತು ನೋಡಲು 'ಜೊತೆಗೆ ಓದಿ' ಒತ್ತಿರಿ...", font: "ಫಾಂಟ್", speed: "ವೇಗ", contrast: "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್", dyslexia: "ಡಿಸ್ಲೆಕ್ಸಿಯಾ ಮೋಡ್", tutorLabel: "AI ಶಿಕ್ಷಕ", footer: "PixelPulse · ಎಲ್ಲರಿಗೂ ಒಳಗೊಳ್ಳುವ ಶಿಕ್ಷಣ" },
  ml: { tagline: "ഓരോ മനസ്സും വ്യത്യസ്തമായി പഠിക്കുന്നു", placeholder: "പഠിക്കാൻ ഏതെങ്കിലും ടെക്സ്റ്റ് ഇവിടെ പേസ്റ്റ് ചെയ്യുക...", read: "🔊 ഒപ്പം വായിക്കുക", pause: "⏸ താൽക്കാലികമായി നിർത്തുക", resume: "▶ തുടരുക", stop: "⏹ നിർത്തുക", explain: "🧑‍🏫 വിശദീകരിക്കുക", sign: "🤟 ആംഗ്യഭാഷ", keyWords: "🔑 പ്രധാന വാക്കുകൾ:", interpreter: "ആംഗ്യഭാഷാ വ്യാഖ്യാതാവ്", signing: "ആംഗ്യം:", save: "⬇ ട്രാൻസ്ക്രിപ്റ്റ് സേവ് ചെയ്യുക", clickRead: "കേൾക്കാനും കാണാനും 'ഒപ്പം വായിക്കുക' അമർത്തുക...", font: "ഫോണ്ട്", speed: "വേഗത", contrast: "ഉയർന്ന കോൺട്രാസ്റ്റ്", dyslexia: "ഡിസ്ലെക്സിയ മോഡ്", tutorLabel: "AI അധ്യാപകൻ", footer: "PixelPulse · എല്ലാവർക്കും ഉൾക്കൊള്ളുന്ന വിദ്യാഭ്യാസം" },
  gu: { tagline: "દરેક મન અલગ રીતે શીખે છે", placeholder: "શીખવા માટે કોઈપણ ટેક્સ્ટ અહીં પેસ્ટ કરો...", read: "🔊 સાથે વાંચો", pause: "⏸ થોભો", resume: "▶ ચાલુ", stop: "⏹ બંધ", explain: "🧑‍🏫 સમજાવો", sign: "🤟 સાંકેતિક ભાષા", keyWords: "🔑 મુખ્ય શબ્દો:", interpreter: "સાંકેતિક ભાષા દુભાષિયો", signing: "સંકેત:", save: "⬇ ટ્રાન્સક્રિપ્ટ સાચવો", clickRead: "સાંભળવા અને જોવા 'સાથે વાંચો' દબાવો...", font: "ફોન્ટ", speed: "ઝડપ", contrast: "ઉચ્ચ કોન્ટ્રાસ્ટ", dyslexia: "ડિસ્લેક્સિયા મોડ", tutorLabel: "AI શિક્ષક", footer: "PixelPulse · બધા માટે સમાવેશી શિક્ષણ" },
  pa: { tagline: "ਹਰ ਮਨ ਵੱਖਰੇ ਤਰੀਕੇ ਨਾਲ ਸਿੱਖਦਾ ਹੈ", placeholder: "ਸਿੱਖਣ ਲਈ ਕੋਈ ਵੀ ਟੈਕਸਟ ਇੱਥੇ ਪੇਸਟ ਕਰੋ...", read: "🔊 ਨਾਲ ਪੜ੍ਹੋ", pause: "⏸ ਰੋਕੋ", resume: "▶ ਜਾਰੀ ਰੱਖੋ", stop: "⏹ ਬੰਦ ਕਰੋ", explain: "🧑‍🏫 ਸਮਝਾਓ", sign: "🤟 ਸੰਕੇਤ ਭਾਸ਼ਾ", keyWords: "🔑 ਮੁੱਖ ਸ਼ਬਦ:", interpreter: "ਸੰਕੇਤ ਭਾਸ਼ਾ ਦੁਭਾਸ਼ੀਆ", signing: "ਸੰਕੇਤ:", save: "⬇ ਟ੍ਰਾਂਸਕ੍ਰਿਪਟ ਸੇਵ ਕਰੋ", clickRead: "ਸੁਣਨ ਅਤੇ ਵੇਖਣ ਲਈ 'ਨਾਲ ਪੜ੍ਹੋ' ਦਬਾਓ...", font: "ਫੌਂਟ", speed: "ਗਤੀ", contrast: "ਉੱਚ ਕੰਟ੍ਰਾਸਟ", dyslexia: "ਡਿਸਲੈਕਸੀਆ ਮੋਡ", tutorLabel: "AI ਅਧਿਆਪਕ", footer: "PixelPulse · ਸਾਰਿਆਂ ਲਈ ਸੰਮਿਲਿਤ ਸਿੱਖਿਆ" },
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
  const [tutorLoading, setTutorLoading] = useState(false);
  const [signMode, setSignMode] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  const T = UI[lang] || UI.en;

  const translate = async (src: string) => {
    if (lang === "en") return src;
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(src.slice(0, 500))}`;
      const res = await fetch(url);
      const data = await res.json();
      return data[0].map((item: any) => item[0]).join("");
    } catch (e) {
      return src;
    }
  };

  const extractKeywords = (t: string) => {
    const cleaned = t.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    const freq: Record<string, number> = {};
    cleaned.forEach(w => {
      if (w.length > 4 && !STOPWORDS.includes(w)) freq[w] = (freq[w] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
  };

  const speak = async () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentIdx(-1);

    // Translate to target language first
    const speakText = await translate(text);
    const w = speakText.split(/\s+/).filter(Boolean);
    setWords(w);
    setKeywords(extractKeywords(text));

    const u = new SpeechSynthesisUtterance(speakText);
    u.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    let pick = voices.find(v => v.lang.toLowerCase().startsWith(lang));
    if (!pick && lang === "hi") pick = voices.find(v => v.lang.toLowerCase().includes("hi"));
    if (!pick && lang === "ta") pick = voices.find(v => v.lang.toLowerCase().includes("ta"));
    if (!pick && lang === "te") pick = voices.find(v => v.lang.toLowerCase().includes("te"));
    if (!pick && lang === "bn") pick = voices.find(v => v.lang.toLowerCase().includes("bn"));
    if (!pick) pick = voices.find(v => v.lang.toLowerCase().startsWith("en"));
    if (pick) u.voice = pick;

    u.onstart = () => { setSpeaking(true); setPaused(false); };
    u.onend = () => { setSpeaking(false); setCurrentIdx(-1); };
    u.onboundary = (e) => {
      if (e.name === "word") {
        const idx = speakText.slice(0, e.charIndex).trim().split(/\s+/).length - 1;
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

  const explain = async () => {
    if (!text.trim()) return;
    setTutor("");
    setTutorLoading(true);
    const translated = await translate(text);
    setTutor(translated);
    setTutorLoading(false);
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
        <p style={{ marginTop: 6, opacity: 0.85 }}>{T.tagline}</p>
      </header>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", background: cardBg, padding: 12, borderRadius: 14, marginBottom: 16, alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{T.font} {fontSize}px</span>
          <input type="range" min={16} max={40} value={fontSize} onChange={e => setFontSize(+e.target.value)} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{T.speed} {rate.toFixed(1)}x</span>
          <input type="range" min={0.5} max={1.5} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} />
          <button onClick={() => setContrast(!contrast)} style={{ padding: "8px 12px", borderRadius: 10, border: 0, cursor: "pointer", background: contrast ? "#FFB703" : "#eee", color: "#111", fontWeight: 600 }}>{T.contrast}</button>
          <button onClick={() => setDyslexia(!dyslexia)} style={{ padding: "8px 12px", borderRadius: 10, border: 0, cursor: "pointer", background: dyslexia ? "#FFB703" : "#eee", color: "#111", fontWeight: 600 }}>{T.dyslexia}</button>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: 8, borderRadius: 10, border: "2px solid #2D6A4F", fontWeight: 600, background: cardBg, color: fg, fontSize: 15 }}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.native} ({l.label})</option>)}
          </select>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: "100%", height: 130, padding: 16, borderRadius: 16, border: "2px solid #2D6A4F", fontSize: 18, fontFamily: "inherit", background: cardBg, color: fg }}
          placeholder={T.placeholder}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={speak} style={{ background: "#2D6A4F", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>{T.read}</button>
          <button onClick={pauseResume} disabled={!speaking} style={{ background: "#555", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer", opacity: speaking ? 1 : 0.5 }}>{paused ? T.resume : T.pause}</button>
          <button onClick={stop} style={{ background: "#999", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>{T.stop}</button>
          <button onClick={explain} style={{ background: "#FFB703", color: "#1B4332", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>{T.explain}</button>
          <button onClick={() => setSignMode(!signMode)} style={{ background: "#2D6A4F", color: "white", padding: "12px 20px", borderRadius: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>{T.sign}</button>
        </div>

        {keywords.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{T.keyWords}</span>
            {keywords.map((k, i) => (
              <span key={i} style={{ background: "#FFB703", color: "#1B4332", padding: "4px 12px", borderRadius: 20, fontSize: 14, fontWeight: 600 }}>{k}</span>
            ))}
          </div>
        )}

        {signMode ? (
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginTop: 20 }}>
            <div style={{ background: cardBg, padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize, lineHeight: 1.9 }}>
              {words.length === 0 && <span style={{ color: "#888" }}>{T.clickRead}</span>}
              {words.map((w, i) => (
                <span key={i} style={{ background: i === currentIdx ? "#FFB703" : "transparent", fontWeight: i === currentIdx ? 800 : 400, padding: i === currentIdx ? "2px 4px" : 0, borderRadius: 4 }}>{w} </span>
              ))}
            </div>
            <div style={{ background: "#2D6A4F", color: "white", padding: 24, borderRadius: 16, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <div style={{ fontSize: 72 }}>🤟</div>
              <p style={{ marginTop: 8, fontWeight: 700 }}>{T.interpreter}</p>
              <p style={{ opacity: 0.85, fontSize: 15 }}>{T.signing} <b>{currentIdx >= 0 && words[currentIdx] ? words[currentIdx] : "—"}</b></p>
              {transcript.length > 0 && (
                <button onClick={downloadTranscript} style={{ marginTop: 12, background: "#FFB703", color: "#1B4332", border: 0, padding: "8px 14px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>{T.save}</button>
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

        {(tutorLoading || tutor) && (
          <div style={{ marginTop: 20, background: cardBg, padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: "#2D6A4F", margin: 0 }}>
              🧑‍🏫 {T.tutorLabel} — {LANGS.find(l => l.code === lang)?.native}
            </h3>
            {tutorLoading ? (
              <p style={{ marginTop: 10, opacity: 0.7 }}>...</p>
            ) : (
              <p style={{ marginTop: 10, fontSize: 18 }}>{tutor}</p>
            )}
          </div>
        )}
      </div>

      <footer style={{ textAlign: "center", marginTop: 40, fontSize: 14, opacity: 0.7 }}>
        {T.footer}
      </footer>
    </main>
  );
}