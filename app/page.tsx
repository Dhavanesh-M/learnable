"use client";

import { useEffect, useRef, useState } from "react";

type Page = "home" | "learn" | "support" | "tests" | "helper" | "voice" | "teacher" | "educator";
type Activity = "reading" | "visuals" | "math";
type RecognitionResult = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type RecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionResult) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionWindow = Window & {
  SpeechRecognition?: new () => RecognitionInstance;
  webkitSpeechRecognition?: new () => RecognitionInstance;
};

const LANGUAGE_OPTIONS = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
];

const COPY: Record<string, Record<string, string>> = {
  en: {
    home: "Home", learn: "Learn", support: "Support", tests: "Real-life tests",
    helper: "Language helper", voice: "Voice & Sign", teacher: "Teacher studio",
    educator: "Educator view", language: "Language", access: "Accessibility",
    title: "Learning Without Limits.", tagline: "A kinder, more flexible way to learn — made for every mind.",
    start: "Start learning", personalise: "Personalise my experience", find: "Find learning support",
    fromTeacher: "From your teacher", listen: "Listen to message", showSign: "Show sign while listening",
    explore: "A little something for every learner", choose: "Choose what feels right today.",
    read: "Read & understand", visuals: "Learn with visuals", maths: "Basic mathematics",
    noPenalty: "Not yet. Have another go. There is no penalty.",
    teacherNote: "Your teacher's message is saved on this computer only.",
    translateNote: "For other page text, try Chrome's built-in Translate where available.",
  },
  hi: {
    home: "होम", learn: "सीखें", support: "सहायता", tests: "जीवन के प्रश्न",
    helper: "भाषा सहायक", voice: "आवाज़ और संकेत", teacher: "शिक्षक स्टूडियो",
    educator: "शिक्षक दृश्य", language: "भाषा", access: "सुलभता",
    title: "सीखने की कोई सीमा नहीं।", tagline: "सीखने का एक सरल और लचीला तरीका — हर मन के लिए।",
    start: "सीखना शुरू करें", personalise: "मेरा अनुभव चुनें", find: "सीखने में सहायता पाएँ",
    fromTeacher: "आपके शिक्षक से", listen: "संदेश सुनें", showSign: "सुनते समय संकेत दिखाएँ",
    explore: "हर विद्यार्थी के लिए कुछ", choose: "आज जो सही लगे, उसे चुनें।",
    read: "पढ़ें और समझें", visuals: "चित्रों से सीखें", maths: "बुनियादी गणित",
    noPenalty: "अभी नहीं। फिर कोशिश करें। कोई दंड नहीं है।",
    teacherNote: "शिक्षक का संदेश केवल इसी कंप्यूटर पर सहेजा जाता है।",
    translateNote: "बाकी पेज के लिए Chrome का अनुवाद उपलब्ध होने पर आज़माएँ।",
  },
  ta: {
    home: "முகப்பு", learn: "கற்க", support: "உதவி", tests: "வாழ்க்கைச் சோதனைகள்",
    helper: "மொழி உதவியாளர்", voice: "குரல் & சைகை", teacher: "ஆசிரியர் பகுதி",
    educator: "கல்வியாளர் பார்வை", language: "மொழி", access: "அணுகல்தன்மை",
    title: "எல்லையில்லா கற்றல்.", tagline: "ஒவ்வொரு மனதுக்கும் ஏற்ற எளிய, நெகிழ்வான கற்றல் வழி.",
    start: "கற்கத் தொடங்கு", personalise: "என் அனுபவத்தைத் தேர்வு செய்", find: "கற்றல் உதவி பெறு",
    fromTeacher: "உங்கள் ஆசிரியரிடமிருந்து", listen: "செய்தியைக் கேள்", showSign: "கேட்கும்போது சைகையைக் காட்டு",
    explore: "ஒவ்வொரு மாணவருக்கும் ஏதோ ஒன்று", choose: "இன்று உங்களுக்கு ஏற்றதைத் தேர்வு செய்யுங்கள்.",
    read: "படித்து புரிந்துகொள்", visuals: "படங்களுடன் கற்க", maths: "அடிப்படை கணிதம்",
    noPenalty: "இன்னும் சரியில்லை. மீண்டும் முயற்சி செய். தண்டனை இல்லை.",
    teacherNote: "ஆசிரியரின் செய்தி இந்தக் கணினியில் மட்டுமே சேமிக்கப்படும்.",
    translateNote: "மற்ற உரைக்கு Chrome மொழிபெயர்ப்பை, கிடைத்தால், முயற்சிக்கவும்.",
  },
  te: {
    home: "హోమ్", learn: "నేర్చుకోండి", support: "సహాయం", tests: "జీవిత పరీక్షలు",
    helper: "భాష సహాయకుడు", voice: "వాయిస్ & సంకేతం", teacher: "టీచర్ స్టూడియో",
    educator: "ఎడ్యుకేటర్ వీక్షణ", language: "భాష", access: "ప్రాప్యత",
    title: "అపరిమిత అభ్యాసం.", tagline: "ప్రతి మనసుకు సరిపోయే సరళమైన, అనువైన అభ్యాస మార్గం.",
    start: "నేర్చుకోవడం ప్రారంభించండి", personalise: "నా అనుభవాన్ని ఎంచుకోండి", find: "అభ్యాస సహాయం పొందండి",
    fromTeacher: "మీ టీచర్ నుండి", listen: "సందేశం వినండి", showSign: "వింటున్నప్పుడు సంకేతం చూపించు",
    explore: "ప్రతి విద్యార్థికి ఏదో ఒకటి", choose: "ఈ రోజు మీకు నచ్చినదాన్ని ఎంచుకోండి.",
    read: "చదివి అర్థం చేసుకోండి", visuals: "చిత్రాలతో నేర్చుకోండి", maths: "ప్రాథమిక గణితం",
    noPenalty: "ఇంకా కాదు. మళ్లీ ప్రయత్నించండి. ఎలాంటి శిక్ష లేదు.",
    teacherNote: "టీచర్ సందేశం ఈ కంప్యూటర్‌లో మాత్రమే సేవ్ చేయబడుతుంది.",
    translateNote: "మిగతా పేజీ కోసం Chrome అనువాదం అందుబాటులో ఉంటే ప్రయత్నించండి.",
  },
};

const ACTIVITY_QUESTIONS: Record<Activity, Array<{ prompt: string; choices: string[]; answer: string; visual?: string }>> = {
  reading: [
    { prompt: "Mina waters the small plant every morning. What does Mina do each morning?", choices: ["Waters a plant", "Reads a book", "Feeds a bird"], answer: "Waters a plant" },
    { prompt: "The plant grows taller when it gets water and sunlight. What helps the plant grow?", choices: ["Water and sunlight", "A toy and a box", "Rain boots"], answer: "Water and sunlight" },
  ],
  visuals: [
    { prompt: "Which one is a bird?", choices: ["🐦 Bird", "🌳 Tree", "☀️ Sun"], answer: "🐦 Bird", visual: "🐦 🌳 ☀️" },
    { prompt: "What gives us light during the day?", choices: ["🌙 Moon", "☀️ Sun", "🐟 Fish"], answer: "☀️ Sun", visual: "🌙 ☀️ 🐟" },
  ],
  math: [
    { prompt: "You have 2 mangoes and get 1 more. How many mangoes now?", choices: ["2", "3", "4"], answer: "3", visual: "🥭 🥭 + 🥭" },
    { prompt: "There are 5 birds. 2 fly away. How many remain?", choices: ["2", "3", "5"], answer: "3", visual: "🐦 🐦 🐦 🐦 🐦" },
  ],
};

const TEST_QUESTIONS = [
  { prompt: "A wheelchair user needs to get up one step. What can help?", choices: ["A ramp", "A taller step", "A slippery mat"], answer: "A ramp", visual: "♿  →  ▱" },
  { prompt: "A seesaw is an example of which simple machine?", choices: ["Lever", "Pulley", "Wheel"], answer: "Lever", visual: "⚖️" },
  { prompt: "A long ramp makes it easier to move a heavy box because…", choices: ["The push can be gentler", "The box becomes lighter", "It removes gravity"], answer: "The push can be gentler", visual: "📦  ↗" },
];

const PICTURE_WORDS: Record<string, string> = {
  tree: "🌳", bird: "🐦", sun: "☀️", flower: "🌼", water: "💧",
  book: "📘", child: "🧒", children: "🧒", cat: "🐈", dog: "🐕",
  school: "🏫", apple: "🍎", mango: "🥭", home: "🏠", moon: "🌙",
};

function speakText(text: string, lang: string, rate = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "en" ? "en-IN" : `${lang}-IN`;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
  return true;
}

function pictureFor(message: string) {
  const tokens = message.toLowerCase().match(/[a-z]+/g) ?? [];
  return [...new Set(tokens.filter((word) => PICTURE_WORDS[word]))].slice(0, 6);
}

export default function Home() {
  const [page, setPage] = useState<Page>("home");
  const [language, setLanguage] = useState("en");
  const [accessOpen, setAccessOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [easyRead, setEasyRead] = useState(false);
  const [lessMotion, setLessMotion] = useState(false);
  const [moreSpace, setMoreSpace] = useState(false);
  const [sharedMessage, setSharedMessage] = useState("Today we will see a tree, a bird and the sun.");
  const [teacherMessage, setTeacherMessage] = useState("");
  const [showSign, setShowSign] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [testsIndex, setTestsIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testsComplete, setTestsComplete] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [toolTab, setToolTab] = useState<"speech" | "captions" | "sign">("speech");
  const [lessonText, setLessonText] = useState("Today we will see a tree, a bird and the sun.");
  const [caption, setCaption] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const [helperText, setHelperText] = useState("");
  const [helperReply, setHelperReply] = useState("");
  const [educatorFilter, setEducatorFilter] = useState("All learners");

  const copy = COPY[language] ?? COPY.en;

  useEffect(() => {
    const savedMessage = window.localStorage.getItem("learnable-class-message");
    const savedBest = Number(window.localStorage.getItem("learnable-best-test-score") ?? "0");
    window.setTimeout(() => {
      if (savedMessage) setSharedMessage(savedMessage);
      if (Number.isFinite(savedBest)) setBestScore(savedBest);
    }, 0);

    const syncMessage = (event: StorageEvent) => {
      if (event.key === "learnable-class-message" && event.newValue) setSharedMessage(event.newValue);
    };
    window.addEventListener("storage", syncMessage);
    return () => window.removeEventListener("storage", syncMessage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en-IN" : `${language}-IN`;
  }, [language]);

  useEffect(() => () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
  }, []);

  const navItems: Array<{ id: Page; label: string; icon: string }> = [
    { id: "home", label: copy.home, icon: "⌂" },
    { id: "learn", label: copy.learn, icon: "✳" },
    { id: "support", label: copy.support, icon: "♡" },
    { id: "tests", label: copy.tests, icon: "↗" },
    { id: "helper", label: copy.helper, icon: "文" },
    { id: "voice", label: copy.voice, icon: "◖" },
    { id: "teacher", label: copy.teacher, icon: "▤" },
    { id: "educator", label: copy.educator, icon: "◫" },
  ];

  const goTo = (target: Page) => {
    setPage(target);
    setAccessOpen(false);
    window.scrollTo({ top: 0, behavior: lessMotion ? "instant" : "smooth" });
  };

  const beginActivity = (nextActivity: Activity) => {
    setActivity(nextActivity);
    setQuestionIndex(0);
    setSelectedAnswer("");
  };

  const currentQuestions = activity ? ACTIVITY_QUESTIONS[activity] : [];
  const currentQuestion = currentQuestions[questionIndex];
  const testQuestion = TEST_QUESTIONS[testsIndex];

  const selectActivityAnswer = (answer: string) => {
    if (answer === currentQuestion?.answer) setSelectedAnswer(answer);
    else setSelectedAnswer(`wrong:${answer}`);
  };

  const nextActivityQuestion = () => {
    setQuestionIndex((index) => index + 1);
    setSelectedAnswer("");
  };

  const chooseTestAnswer = (answer: string) => {
    if (answer !== testQuestion.answer) {
      setSelectedAnswer(`wrong:${answer}`);
      return;
    }
    const nextScore = testScore + 1;
    setTestScore(nextScore);
    setSelectedAnswer(answer);
    if (testsIndex === TEST_QUESTIONS.length - 1) {
      setTestsComplete(true);
      const nextBest = Math.max(bestScore, nextScore);
      setBestScore(nextBest);
      window.localStorage.setItem("learnable-best-test-score", String(nextBest));
    } else {
      window.setTimeout(() => {
        setTestsIndex((index) => index + 1);
        setSelectedAnswer("");
      }, 650);
    }
  };

  const shareWithClass = () => {
    const message = teacherMessage.trim();
    if (!message) return;
    window.localStorage.setItem("learnable-class-message", message);
    setSharedMessage(message);
    setTeacherMessage("");
  };

  const listenToMessage = () => {
    speakText(sharedMessage, language);
  };

  const startCaptions = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const speechWindow = window as RecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setCaption("Live speech recognition is not available in this browser. Try Chrome or use your device's live captions.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = language === "en" ? "en-IN" : `${language}-IN`;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const latest = event.results[event.results.length - 1];
      if (latest?.[0]) setCaption((value) => `${value} ${latest[0].transcript}`.trim());
    };
    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
      setCaption("The microphone could not be started. Check browser permission and try again.");
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    setCaption("");
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const recognizeAndReply = (text: string) => {
    const detected = /[\u0B80-\u0BFF]/.test(text) ? "ta"
      : /[\u0C00-\u0C7F]/.test(text) ? "te"
        : /[\u0900-\u097F]/.test(text) ? "hi" : language;
    setLanguage(detected);
    const replies: Record<string, string> = {
      en: "I heard you. Let’s learn together.",
      hi: "मैंने आपकी बात सुनी। आइए, साथ में सीखें।",
      ta: "நான் உங்கள் செய்தியைக் கேட்டேன். ஒன்றாகக் கற்போம்.",
      te: "మీ మాట విన్నాను. కలిసి నేర్చుకుందాం.",
    };
    setHelperReply(replies[detected]);
  };

  const listenForHelperInput = () => {
    const speechWindow = window as RecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setHelperReply("Speech input is not available in this browser. You can type your message instead.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = language === "en" ? "en-IN" : `${language}-IN`;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1]?.[0]?.transcript;
      if (result) {
        setHelperText(result);
        recognizeAndReply(result);
      }
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
      setHelperReply("The microphone could not be started. Check browser permission or type your message.");
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const replyToHelper = () => {
    const text = helperText.trim();
    if (!text) return;
    recognizeAndReply(text);
  };

  const resetAccessibility = () => {
    setLargeText(false);
    setHighContrast(false);
    setEasyRead(false);
    setLessMotion(false);
    setMoreSpace(false);
  };

  const shellClasses = [
    "app-shell",
    highContrast ? "high-contrast" : "",
    largeText ? "large-text" : "",
    easyRead ? "easy-read" : "",
    lessMotion ? "less-motion" : "",
    moreSpace ? "more-space" : "",
  ].filter(Boolean).join(" ");

  const signPanel = showSign ? (
    <div className="sign-note" role="status">
      <span className="sign-note-icon" aria-hidden="true">🤟</span>
      <div>
        <strong>Sign video unavailable</strong>
        <p>We do not include sign clips yet. Sign videos must be provided by a qualified Indian Sign Language interpreter; we will not substitute an unverified sign.</p>
      </div>
      <div className="sign-controls" aria-label="Sign video controls">
        <button type="button" disabled>▶ Play</button>
        <button type="button" disabled>Ⅱ Pause</button>
        <button type="button" disabled>↺ Replay</button>
        <label>Speed <select disabled defaultValue="1"><option value="1">1×</option></select></label>
      </div>
    </div>
  ) : null;

  return (
    <main className={shellClasses}>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="site-wrap">
        <header className="site-header">
          <button type="button" className="brand" onClick={() => goTo("home")} aria-label="LearnAble home">
            <span className="brand-mark">L<span>✳</span></span>
            <span>learn<span>able</span></span>
          </button>
          <nav className="top-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <button key={item.id} type="button" className={`nav-link ${page === item.id ? "active" : ""}`} onClick={() => goTo(item.id)}>
                <span aria-hidden="true">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <label className="language-select">
              <span className="sr-only">{copy.language}</span>
              <span aria-hidden="true">◎</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={copy.language}>
                {LANGUAGE_OPTIONS.map((option) => <option key={option.code} value={option.code}>{option.native}</option>)}
              </select>
            </label>
            <div className="access-wrap">
              <button type="button" className="access-button" aria-expanded={accessOpen} onClick={() => setAccessOpen((open) => !open)}>
                ◉ <span>{copy.access}</span>
              </button>
              {accessOpen && (
                <section className="access-popover" aria-label="Accessibility settings">
                  <div className="popover-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Accessibility</h2></div><button type="button" className="icon-button" onClick={() => setAccessOpen(false)} aria-label="Close accessibility settings">×</button></div>
                  <label className="setting-row"><span><b>Larger text</b><small>Make words easier to see</small></span><input type="checkbox" checked={largeText} onChange={(event) => setLargeText(event.target.checked)} /></label>
                  <label className="setting-row"><span><b>High contrast</b><small>Stronger colour contrast</small></span><input type="checkbox" checked={highContrast} onChange={(event) => setHighContrast(event.target.checked)} /></label>
                  <label className="setting-row"><span><b>Easy-read font</b><small>Clearer letter shapes</small></span><input type="checkbox" checked={easyRead} onChange={(event) => setEasyRead(event.target.checked)} /></label>
                  <label className="setting-row"><span><b>Less motion</b><small>Reduce movement and transitions</small></span><input type="checkbox" checked={lessMotion} onChange={(event) => setLessMotion(event.target.checked)} /></label>
                  <label className="setting-row"><span><b>More space</b><small>Open up words and sections</small></span><input type="checkbox" checked={moreSpace} onChange={(event) => setMoreSpace(event.target.checked)} /></label>
                  <button type="button" className="text-button reset-button" onClick={resetAccessibility}>↺ Reset everything</button>
                </section>
              )}
            </div>
          </div>
        </header>

        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow"><span className="eyebrow-dot" /> A LEARNING SPACE THAT GETS YOU</div>
                <h1>{copy.title}</h1>
                <p className="hero-subtitle">{copy.tagline}</p>
                <div className="hero-actions">
                  <button type="button" className="button button-primary" onClick={() => goTo("learn")}>{copy.start}<span aria-hidden="true">↗</span></button>
                  <button type="button" className="button button-light" onClick={() => { setAccessOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{copy.personalise}<span aria-hidden="true">✳</span></button>
                  <button type="button" className="button button-outline" onClick={() => goTo("support")}>{copy.find}<span aria-hidden="true">→</span></button>
                </div>
                <div className="hero-footnote"><span className="avatar-stack"><i>☺</i><i>✿</i><i>☼</i></span><span>Small steps. Bright ideas. <b>Every learner belongs.</b></span></div>
              </div>
              <div className="hero-art" aria-label="Illustration of a child reading beneath a tree">
                <div className="sun-orb" />
                <span className="sparkle sparkle-one">✦</span><span className="sparkle sparkle-two">✳</span>
                <div className="art-cloud cloud-one" /><div className="art-cloud cloud-two" />
                <div className="hill hill-back" /><div className="hill hill-front" />
                <div className="tree-art"><div className="tree-crown crown-one" /><div className="tree-crown crown-two" /><div className="tree-crown crown-three" /><div className="tree-trunk" /></div>
                <div className="reader-art"><span className="reader-hair" /><span className="reader-face">◡</span><span className="reader-body" /><span className="reader-book">▰</span></div>
                <div className="art-caption"><span>✦</span> Learn in your own way</div>
              </div>
            </section>

            <section className="teacher-card">
              <div className="teacher-card-copy">
                <div className="section-label"><span className="label-icon">✉</span>{copy.fromTeacher}</div>
                <h2>A little note just for you</h2>
                <p className="teacher-message">“{sharedMessage}”</p>
                <div className="teacher-card-actions">
                  <button type="button" className="button button-primary button-small" onClick={listenToMessage}>◖ {copy.listen}</button>
                  <label className="inline-check"><input type="checkbox" checked={showSign} onChange={(event) => setShowSign(event.target.checked)} />{copy.showSign}</label>
                </div>
                {signPanel}
                <p className="tiny-note"><span>ⓘ</span> Messages shared by your teacher stay on this computer only.</p>
              </div>
              <div className="message-illustration">
                <div className="illustration-sun">☀</div>
                <div className="illustration-tree">🌳</div>
                <div className="illustration-bird">🐦</div>
                <div className="illustration-ground" />
                <span className="illustration-spark">✦</span>
              </div>
            </section>

            <section className="home-learning">
              <div className="section-heading">
                <div><div className="eyebrow">YOUR NEXT LITTLE ADVENTURE</div><h2>{copy.explore}</h2><p>{copy.choose}</p></div>
                <button type="button" className="text-button" onClick={() => goTo("learn")}>See all activities <span>→</span></button>
              </div>
              <ActivityCards onChoose={(selected) => { beginActivity(selected); goTo("learn"); }} copy={copy} />
            </section>
            <div className="translation-note">{copy.translateNote} <span>Hindi, Tamil and Telugu menu text needs a native speaker’s review.</span></div>
          </>
        )}

        {page === "learn" && (
          <section className="page-section">
            <PageHeading eyebrow="YOUR LEARNING SPACE" title="Learn at your own pace" description="Pick an activity. There is no rush, and you can always go back." onBack={() => goTo("home")} />
            {!activity ? (
              <ActivityCards onChoose={beginActivity} copy={copy} />
            ) : questionIndex >= currentQuestions.length ? (
              <div className="quiz-card completion-card"><span className="completion-icon">✦</span><div className="eyebrow">NICE WORK</div><h2>You did it!</h2><p>You finished this activity. Learning takes practice, and you showed up.</p><button type="button" className="button button-primary" onClick={() => { setActivity(null); setQuestionIndex(0); }}>Choose another activity</button></div>
            ) : (
              <div className="quiz-card">
                <div className="quiz-topline"><button type="button" className="back-button" onClick={() => { if (questionIndex > 0) { setQuestionIndex(questionIndex - 1); setSelectedAnswer(""); } else setActivity(null); }}>← Back</button><span>{questionIndex + 1} of {currentQuestions.length}</span></div>
                <div className="progress-track"><span style={{ width: `${((questionIndex + 1) / currentQuestions.length) * 100}%` }} /></div>
                <div className="quiz-body">
                  {currentQuestion.visual && <div className="quiz-visual" aria-hidden="true">{currentQuestion.visual}</div>}
                  <h2>{currentQuestion.prompt}</h2>
                  {activity === "reading" && <button type="button" className="listen-inline" onClick={() => speakText(currentQuestion.prompt, language)}>◖ Listen to the question</button>}
                  <div className="answer-grid">
                    {currentQuestion.choices.map((choice) => {
                      const wrong = selectedAnswer === `wrong:${choice}`;
                      return <button key={choice} type="button" disabled={Boolean(selectedAnswer && !selectedAnswer.startsWith("wrong:"))} className={`answer-option ${selectedAnswer === choice ? "correct" : ""} ${wrong ? "incorrect" : ""}`} onClick={() => selectActivityAnswer(choice)}>{choice}<span>{selectedAnswer === choice ? "✓" : "→"}</span></button>;
                    })}
                  </div>
                  {selectedAnswer.startsWith("wrong:") && <p className="gentle-feedback" role="status">{copy.noPenalty}</p>}
                  {selectedAnswer && !selectedAnswer.startsWith("wrong:") && <div className="right-feedback"><span>✓</span> That&apos;s right. Well done! <button type="button" className="button button-primary button-small" onClick={nextActivityQuestion}>{questionIndex === currentQuestions.length - 1 ? "Finish" : "Next question"} →</button></div>}
                </div>
              </div>
            )}
          </section>
        )}

        {page === "support" && (
          <section className="page-section">
            <PageHeading eyebrow="HERE FOR YOU" title="Find the support that fits" description="Learning can look different for everyone. Choose a tool and make this space yours." onBack={() => goTo("home")} />
            <div className="support-grid">
              <SupportCard icon="◖" title="Listen to words" detail="Hear a message or question read aloud at a gentle pace." action="Try read aloud" onClick={() => goTo("voice")} />
              <SupportCard icon="Aa" title="Make reading easier" detail="Change text size, colours, spacing and font whenever you need." action="Open accessibility" onClick={() => setAccessOpen(true)} />
              <SupportCard icon="文" title="Use your language" detail="Type or speak in a language that feels comfortable." action="Open language helper" onClick={() => goTo("helper")} />
              <SupportCard icon="♡" title="Take a breather" detail="There are no timers or penalties here. You can pause and come back." action="Explore learning" onClick={() => goTo("learn")} />
            </div>
            <div className="honesty-card"><span>ⓘ</span><p>We want to be honest about what is available: sign-language videos are not included yet. Future clips must be checked by a qualified Indian Sign Language interpreter.</p></div>
          </section>
        )}

        {page === "tests" && (
          <section className="page-section">
            <PageHeading eyebrow="EVERYDAY DISCOVERIES" title="Real-life tests" description="Think about ramps and levers. Take your time — there is no timer." onBack={() => goTo("home")} />
            <div className="quiz-card test-card">
              {testsComplete ? (
                <div className="test-result"><span className="completion-icon">✦</span><div className="eyebrow">YOUR RESULT</div><h2>{testScore} out of {TEST_QUESTIONS.length}</h2><p>Your best score on this computer: <b>{bestScore} / {TEST_QUESTIONS.length}</b></p><p className="tiny-note">Saved on this computer only. No name or account needed.</p><button type="button" className="button button-primary" onClick={() => { setTestsIndex(0); setTestScore(0); setTestsComplete(false); setSelectedAnswer(""); }}>Try again</button></div>
              ) : (
                <>
                  <div className="quiz-topline"><button type="button" className="back-button" onClick={() => goTo("home")}>← Back</button><span>Question {testsIndex + 1} of {TEST_QUESTIONS.length}</span></div>
                  <div className="progress-track"><span style={{ width: `${((testsIndex + 1) / TEST_QUESTIONS.length) * 100}%` }} /></div>
                  <div className="quiz-body"><div className="quiz-visual" aria-hidden="true">{testQuestion.visual}</div><h2>{testQuestion.prompt}</h2><div className="answer-grid">{testQuestion.choices.map((choice) => <button key={choice} type="button" disabled={Boolean(selectedAnswer && !selectedAnswer.startsWith("wrong:"))} className={`answer-option ${selectedAnswer === choice ? "correct" : ""} ${selectedAnswer === `wrong:${choice}` ? "incorrect" : ""}`} onClick={() => chooseTestAnswer(choice)}>{choice}<span>{selectedAnswer === choice ? "✓" : "→"}</span></button>)}</div>{selectedAnswer.startsWith("wrong:") && <p className="gentle-feedback" role="status">{copy.noPenalty}</p>}</div>
                </>
              )}
            </div>
            {!testsComplete && <p className="privacy-note">Your best score is kept on this computer only. No name needed.</p>}
          </section>
        )}

        {page === "helper" && (
          <section className="page-section">
            <PageHeading eyebrow="SAY IT YOUR WAY" title="Language helper" description="Type or speak in a language you know. The page will switch when it recognises Hindi, Tamil or Telugu." onBack={() => goTo("home")} />
            <div className="helper-card">
              <label htmlFor="helper-input" className="field-label">Your words</label>
              <textarea id="helper-input" value={helperText} onChange={(event) => setHelperText(event.target.value)} placeholder="Type in English, हिन्दी, தமிழ் or తెలుగు…" rows={5} />
              <div className="form-actions"><button type="button" className="button button-primary" onClick={replyToHelper}>↗ Recognise language</button><button type="button" className="button button-light" onClick={listenForHelperInput}>◖ {listening ? "Listening…" : "Speak to type"}</button><button type="button" className="button button-light" onClick={() => speakText(helperText, language)}>◖ Speak text</button></div>
              {helperReply && <div className="helper-reply" role="status"><span className="reply-spark">✦</span><div><div className="eyebrow">A LITTLE REPLY · {LANGUAGE_OPTIONS.find((option) => option.code === language)?.native}</div><p>{helperReply}</p><button type="button" className="text-button" onClick={() => speakText(helperReply, language)}>◖ Listen to reply</button></div></div>}
              <p className="tiny-note">Language recognition here uses the writing system for Hindi, Tamil and Telugu. Replies are sample phrases, not live translation. Chrome Translate may help with other page text.</p>
            </div>
          </section>
        )}

        {page === "voice" && (
          <section className="page-section">
            <PageHeading eyebrow="MORE WAYS TO COMMUNICATE" title="Voice & sign" description="Use read-aloud, live captions where your browser supports them, or learn about our sign-language limits." onBack={() => goTo("home")} />
            <div className="tool-tabs" role="tablist" aria-label="Voice and sign tools">
              <button type="button" role="tab" aria-selected={toolTab === "speech"} className={toolTab === "speech" ? "selected" : ""} onClick={() => setToolTab("speech")}>◖ Text to speech</button>
              <button type="button" role="tab" aria-selected={toolTab === "captions"} className={toolTab === "captions" ? "selected" : ""} onClick={() => setToolTab("captions")}>▤ Speech to text</button>
              <button type="button" role="tab" aria-selected={toolTab === "sign"} className={toolTab === "sign" ? "selected" : ""} onClick={() => setToolTab("sign")}>🤟 Sign language</button>
            </div>
            <div className="tool-panel">
              {toolTab === "speech" && <><h2>Let the words speak</h2><p>Type a sentence and listen to it read aloud.</p><textarea value={lessonText} onChange={(event) => setLessonText(event.target.value)} rows={4} aria-label="Text to read aloud" /><button type="button" className="button button-primary" onClick={() => speakText(lessonText, language)}>◖ Listen</button></>}
              {toolTab === "captions" && <><h2>Live captions for a spoken lesson</h2><p>Captions use your browser&apos;s speech-recognition support. Microphone permission may be needed.</p><button type="button" className={`button ${listening ? "button-outline" : "button-primary"}`} onClick={startCaptions}>{listening ? "■ Stop listening" : "◖ Start captions"}</button><div className="caption-box" aria-live="polite">{caption || "Your live captions will appear here."}</div></>}
              {toolTab === "sign" && <><h2>Sign language</h2><p>We only want to show signs that are accurate and respectful.</p><div className="honesty-card"><span>ⓘ</span><p>No expert-checked sign video matches are available yet. Sign videos must come from a qualified Indian Sign Language interpreter. We will not show a guessed or unverified sign.</p></div></>}
            </div>
          </section>
        )}

        {page === "teacher" && (
          <section className="page-section">
            <PageHeading eyebrow="FOR THE PEOPLE WHO TEACH" title="Teacher studio" description="Create a small illustrated class note and share it with learners on this computer." onBack={() => goTo("home")} />
            <div className="teacher-studio-grid">
              <div className="studio-card"><div className="section-label"><span className="label-icon">✎</span>CLASS MESSAGE</div><label className="field-label" htmlFor="teacher-message">Write a short message</label><textarea id="teacher-message" value={teacherMessage} onChange={(event) => setTeacherMessage(event.target.value)} placeholder="Today we will see a tree, a bird and the sun…" rows={4} /><div className="picture-preview"><div className="eyebrow">PICTURE MAKER · BUILT-IN WORD LIST</div><div className="picture-words">{pictureFor(teacherMessage || "tree bird sun").length ? pictureFor(teacherMessage || "tree bird sun").map((word) => <span key={word}>{PICTURE_WORDS[word]}<small>{word}</small></span>) : <p>No picture words recognised yet. Try tree, bird, sun, flower or book.</p>}</div><p className="tiny-note">This uses a small built-in word list. It is not an AI image generator.</p></div><button type="button" className="button button-primary" disabled={!teacherMessage.trim()} onClick={shareWithClass}>Share with class <span>↗</span></button></div>
              <div className="studio-side"><div className="shared-preview"><div className="section-label"><span className="label-icon">⌂</span>STUDENT HOME PREVIEW</div><h3>From your teacher</h3><p>“{sharedMessage}”</p><div className="mini-picture">{pictureFor(sharedMessage).map((word) => <span key={word}>{PICTURE_WORDS[word]}</span>)}</div><button type="button" className="text-button" onClick={() => goTo("home")}>View student home →</button></div><div className="local-note">ⓘ Shared messages work on this computer only for now.</div></div>
            </div>
            <div className="class-tools"><div className="section-heading"><div><div className="eyebrow">CLASS TOOLS</div><h2>More ways to share a lesson</h2></div></div><div className="tool-tabs" role="tablist" aria-label="Class tools"><button type="button" role="tab" aria-selected={toolTab === "speech"} className={toolTab === "speech" ? "selected" : ""} onClick={() => setToolTab("speech")}>Text to speech</button><button type="button" role="tab" aria-selected={toolTab === "captions"} className={toolTab === "captions" ? "selected" : ""} onClick={() => setToolTab("captions")}>Speech to text</button><button type="button" role="tab" aria-selected={toolTab === "sign"} className={toolTab === "sign" ? "selected" : ""} onClick={() => setToolTab("sign")}>Sign language</button></div><div className="tool-panel compact-tool">
              {toolTab === "speech" && <><h3>Read a lesson aloud</h3><div className="form-actions"><button type="button" className="button button-light" onClick={() => speakText(lessonText, language)}>◖ Read lesson</button><span className="tiny-note">Uses speech voices available on this device.</span></div></>}
              {toolTab === "captions" && <><h3>Live captions</h3><p>Start browser speech recognition and show captions for a spoken lesson.</p><button type="button" className="button button-light" onClick={startCaptions}>{listening ? "■ Stop captions" : "◖ Start live captions"}</button><div className="caption-box" aria-live="polite">{caption || "Captions will appear here."}</div></>}
              {toolTab === "sign" && <><h3>Expert-checked sign phrase</h3><p>No verified phrase video is included yet. We do not display guessed signs. An expert-checked Indian Sign Language clip is needed before this tool can show a match.</p></>}
            </div></div>
          </section>
        )}

        {page === "educator" && (
          <section className="page-section">
            <PageHeading eyebrow="A SUPPORTIVE OVERVIEW" title="Educator view" description="Sample classroom signals to help plan the next lesson." onBack={() => goTo("home")} />
            <div className="educator-note"><span>ⓘ</span><p>This is sample data for demonstration. It supports teachers and does not rank children.</p></div>
            <div className="educator-toolbar"><label>Show <select value={educatorFilter} onChange={(event) => setEducatorFilter(event.target.value)}><option>All learners</option><option>Reading practice</option><option>Visual learning</option><option>Needs a check-in</option></select></label><span>Last 7 days <span aria-hidden="true">⌄</span></span></div>
            <div className="metric-grid"><MetricCard number="24" label="Anonymous learners" note="No names shown" icon="☺" /><MetricCard number="78%" label="Activities explored" note="Across this sample class" icon="✳" /><MetricCard number="6" label="May need a check-in" note="A gentle nudge, not a score" icon="♡" /></div>
            <div className="chart-grid"><div className="chart-card"><div className="section-heading"><div><div className="eyebrow">LEARNING ACTIVITY</div><h2>Small steps over time</h2></div><span className="chart-chip">Sample</span></div><div className="bar-chart" aria-label="Sample weekly activity chart"><div className="chart-y"><span>30</span><span>20</span><span>10</span><span>0</span></div>{[["M",42],["T",65],["W",52],["T",78],["F",58],["S",86],["S",48]].map(([day, height], index) => <div className="bar-column" key={`${day}-${index}`}><span style={{ height: `${height}%` }} /><small>{day}</small></div>)}</div></div><div className="chart-card learner-list"><div className="eyebrow">ANONYMOUS LEARNERS</div><h2>Recent activity</h2>{(educatorFilter === "Needs a check-in" ? [["Learner 014", "A gentle check-in may help", "♡"], ["Learner 021", "Taking a little break", "◷"]] : [["Learner 014", "Read & understand", "↗"], ["Learner 008", "Learn with visuals", "✳"], ["Learner 021", "Basic mathematics", "＋"]]).map(([id, info, icon]) => <div className="learner-row" key={id}><span className="learner-avatar">{icon}</span><span><b>{id}</b><small>{info}</small></span><span className="learner-arrow">→</span></div>)}</div></div>
          </section>
        )}

        <footer className="site-footer"><div className="footer-brand"><span className="brand-mark">L<span>✳</span></span> learn<span>able</span></div><p>Learning without limits, one little step at a time.</p><div className="footer-links"><button type="button" onClick={() => goTo("support")}>Support</button><button type="button" onClick={() => goTo("teacher")}>For teachers</button><button type="button" onClick={() => goTo("educator")}>Educator view</button></div><small>Built for every kind of learner <span>✦</span></small></footer>
      </div>
    </main>
  );
}

function ActivityCards({ onChoose, copy }: { onChoose: (activity: Activity) => void; copy: Record<string, string> }) {
  return (
    <div className="activity-grid">
      <button type="button" className="activity-card reading-card" onClick={() => onChoose("reading")}><span className="activity-icon">Aa</span><span className="activity-arrow">↗</span><span className="activity-category">WORDS & STORIES</span><strong>{copy.read}</strong><span className="activity-description">Short stories, gentle questions and read-aloud support.</span><span className="activity-footer">Take it one question at a time <span>→</span></span></button>
      <button type="button" className="activity-card visual-card" onClick={() => onChoose("visuals")}><span className="activity-icon">☼</span><span className="activity-arrow">↗</span><span className="activity-category">PICTURES & IDEAS</span><strong>{copy.visuals}</strong><span className="activity-description">Use pictures and words to explore familiar things.</span><span className="activity-footer">See it, think it, learn it <span>→</span></span></button>
      <button type="button" className="activity-card maths-card" onClick={() => onChoose("math")}><span className="activity-icon">＋</span><span className="activity-arrow">↗</span><span className="activity-category">NUMBERS & PLAY</span><strong>{copy.maths}</strong><span className="activity-description">Friendly number puzzles with room to try again.</span><span className="activity-footer">Every try helps you grow <span>→</span></span></button>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, onBack }: { eyebrow: string; title: string; description: string; onBack: () => void }) {
  return <div className="page-heading"><button type="button" className="back-button page-back" onClick={onBack}>← Home</button><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>;
}

function SupportCard({ icon, title, detail, action, onClick }: { icon: string; title: string; detail: string; action: string; onClick: () => void }) {
  return <article className="support-card"><span className="support-icon">{icon}</span><h2>{title}</h2><p>{detail}</p><button type="button" className="text-button" onClick={onClick}>{action} →</button></article>;
}

function MetricCard({ number, label, note, icon }: { number: string; label: string; note: string; icon: string }) {
  return <article className="metric-card"><span className="metric-icon">{icon}</span><strong>{number}</strong><b>{label}</b><small>{note}</small></article>;
}
