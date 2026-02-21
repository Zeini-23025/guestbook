import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
  "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
];

const girlMessages = [
  "kyaaaa don't stare at me!! 😤",
  "w-what do you want?? 👉👈",
  "stop clicking me omg 😭",
  "...okay fine you can stay 🌸",
  "I saw that 👀",
  "ehehe~ 🐱",
  "you have too much free time 💀",
  "ugh fine... welcome I guess 🙄",
  "OKAY STOP IT 😡🔥",
];

interface Visitor { id: number; name: string; country: string; }

function Petal({ delay, left, duration }: { delay: number; left: number; duration: number }) {
  return (
    <div style={{
      position: "fixed", top: "-30px", left: `${left}%`,
      width: "9px", height: "11px",
      background: "linear-gradient(135deg, #e879a0, #c084fc)",
      borderRadius: "50% 0 50% 0", opacity: 0,
      animation: `petal-fall ${duration}s ${delay}s ease-in infinite`,
      pointerEvents: "none", zIndex: 0, transform: "rotate(45deg)",
    }} />
  );
}

// ── Replace the src below with your actual image URL or local path ──
const GIRL_IMAGE_SRC = "/1.gif";

function AnimeGirl() {
  return (
    <img
      src={GIRL_IMAGE_SRC}
      alt="anime girl"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
        pointerEvents: "none",
        userSelect: "none",
        borderRadius: "12px",
      }}
    />
  );
}

export default function App() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [girlMsg, setGirlMsg] = useState("");
  const [girlMsgVisible, setGirlMsgVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`${API}/api/visitors`).then(r => r.json()).then(setVisitors).catch(() => { });
  }, []);

  const handleGirlClick = () => {
    const c = clickCount + 1;
    setClickCount(c);
    const msg = c >= 7 ? girlMessages[8] : girlMessages[Math.floor(Math.random() * 7)];
    setGirlMsg(msg);
    setGirlMsgVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setGirlMsgVisible(false);
      if (c >= 7) setClickCount(0);
    }, 2400);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !country) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/visitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, country }),
      });
      const v = await res.json();
      setVisitors(prev => [v, ...prev]);
      setSubmitted(true); setShowForm(false);
      setName(""); setCountry("");
    } catch { alert("Server error!"); }
    setLoading(false);
  };

  const petals = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 1.5, left: 3 + i * 8, duration: 7 + (i % 4) * 1.5,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=Noto+Serif+JP:wght@400;700&display=swap');

        :root {
          --bg: #0a0812;
          --surface: #110f1c;
          --surface2: #1a1628;
          --border: #231f35;
          --pink: #e879a0;
          --pink-soft: #f0abca;
          --pink-glow: rgba(232,121,160,0.15);
          --purple: #c084fc;
          --text: #f0ecff;
          --muted: #5e5878;
          --muted2: #8b82a8;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Outfit', sans-serif;
          background: var(--bg); color: var(--text);
          min-height: 100vh; overflow-x: hidden;
        }

        @keyframes petal-fall {
          0%   { transform: rotate(45deg) translateY(0) translateX(0); opacity:0; }
          8%   { opacity: 0.6; }
          92%  { opacity: 0.3; }
          100% { transform: rotate(265deg) translateY(115vh) translateX(80px); opacity:0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(-0.5deg); }
          50%     { transform: translateY(-16px) rotate(0.5deg); }
        }
        @keyframes fade-up {
          from { opacity:0; transform: translateY(22px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes pop-in {
          0%  { opacity:0; transform: scale(0.78); }
          65% { transform: scale(1.04); }
          100%{ opacity:1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          50%     { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
        }
        @keyframes msg-pop {
          0%  { opacity:0; transform: translateX(-50%) scale(0.85) translateY(4px); }
          100%{ opacity:1; transform: translateX(-50%) scale(1) translateY(0); }
        }

        .scanline {
          position: fixed; inset:0; z-index:1; pointer-events:none;
          background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px);
        }
        .page {
          position: relative; z-index:2;
          max-width: 860px; margin:0 auto;
          padding: 3rem 1.5rem 6rem;
        }

        /* topbar */
        .topbar {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom: 3.5rem;
          animation: fade-up 0.5s ease both;
        }
        .logo { font-family:'Noto Serif JP',serif; font-size:0.82rem; color:var(--muted); letter-spacing:3px; }
        .live { display:flex; align-items:center; gap:7px; font-size:0.78rem; color:var(--muted2); font-weight:600; }
        .live-dot { width:7px; height:7px; border-radius:50%; background:#4ade80; animation: pulse-dot 1.8s ease infinite; }

        /* hero */
        .hero {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 3rem;
          align-items: center;
          margin-bottom: 3rem;
          animation: fade-up 0.6s 0.05s ease both;
        }
        .hero-title {
          font-size: clamp(2.6rem, 6vw, 4rem);
          font-weight: 900; line-height: 1.0; letter-spacing: -2px;
        }
        .hero-title .t1 { color: var(--text); display:block; }
        .hero-title .t2 {
          display:block;
          background: linear-gradient(90deg, var(--pink), var(--purple), var(--pink));
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }
        .hero-sub { margin-top:1rem; color:var(--muted2); font-size:0.93rem; line-height:1.7; max-width:360px; }
        .hero-hint { margin-top:1.2rem; font-size:0.78rem; color:var(--muted); }

        /* girl */
        .girl-wrap {
          position: relative;
          cursor: pointer; user-select: none;
          animation: float 3.5s ease-in-out infinite;
          filter: drop-shadow(0 16px 40px rgba(232,121,160,0.25));
          transition: filter 0.3s;
          width: 260px;
          height: 420px;
        }
        .girl-wrap:hover { filter: drop-shadow(0 20px 50px rgba(232,121,160,0.4)); }
        .girl-msg {
          position: absolute; top: -10px; left: 50%;
          transform: translateX(-50%);
          background: rgba(10,8,18,0.92);
          backdrop-filter: blur(10px);
          border: 1px solid var(--pink);
          border-radius: 20px; padding: 0.5rem 1rem;
          font-size: 0.82rem; font-weight: 600;
          color: var(--pink-soft); white-space: nowrap;
          pointer-events: none;
          animation: msg-pop 0.2s ease;
          box-shadow: 0 4px 20px var(--pink-glow);
          z-index: 10;
        }

        /* stats */
        .stats {
          display:flex; gap:1px;
          background:var(--border); border-radius:18px; overflow:hidden;
          margin-bottom:2.5rem;
          animation: fade-up 0.6s 0.1s ease both;
        }
        .stat { flex:1; background:var(--surface); padding:1.3rem 1.6rem; transition:background 0.2s; }
        .stat:hover { background:var(--surface2); }
        .stat .val { font-size:2.2rem; font-weight:900; color:var(--pink); line-height:1; letter-spacing:-1px; }
        .stat .lbl { font-size:0.78rem; color:var(--muted); margin-top:0.3rem; }

        /* roast */
        .roast {
          background:var(--surface); border:1px solid var(--border);
          border-left:3px solid var(--pink);
          border-radius:0 16px 16px 0;
          padding:1.3rem 1.6rem; margin-bottom:2.5rem;
          font-size:0.94rem; color:#b8b0d0; line-height:1.75;
          animation: fade-up 0.6s 0.15s ease both;
        }
        .roast strong { color:var(--pink); }
        .roast .soft { display:block; margin-top:0.4rem; font-size:0.84rem; color:var(--muted2); font-style:italic; }

        /* cta */
        .cta-zone { margin-bottom:3rem; animation: fade-up 0.6s 0.2s ease both; }
        .cta-btn {
          position:relative; overflow:hidden;
          background:var(--pink); color:white; border:none;
          padding:0.9rem 2.4rem; border-radius:50px;
          font-family:'Outfit',sans-serif; font-size:1rem; font-weight:700;
          cursor:pointer; transition:transform 0.15s, box-shadow 0.2s;
          box-shadow:0 4px 24px rgba(232,121,160,0.35);
        }
        .cta-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:translateX(-100%); transition:transform 0.45s;
        }
        .cta-btn:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(232,121,160,0.45); }
        .cta-btn:hover::after { transform:translateX(100%); }
        .success-bar {
          display:flex; align-items:center; gap:0.8rem;
          background:rgba(74,222,128,0.07); border:1px solid rgba(74,222,128,0.25);
          border-radius:14px; padding:0.9rem 1.3rem;
          color:#4ade80; font-weight:600; font-size:0.92rem;
        }

        /* form */
        .form-card {
          background:var(--surface); border:1px solid var(--border);
          border-radius:20px; padding:1.8rem;
          animation: pop-in 0.3s ease;
        }
        .form-card h3 { font-size:0.98rem; font-weight:700; margin-bottom:1.2rem; opacity:0.85; }
        .form-row { display:flex; gap:0.8rem; flex-wrap:wrap; margin-bottom:1rem; }
        .form-row input, .form-row select {
          flex:1; min-width:160px;
          background:var(--bg); border:1px solid var(--border); border-radius:12px;
          padding:0.75rem 1rem; color:var(--text);
          font-family:'Outfit',sans-serif; font-size:0.93rem; outline:none;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .form-row input::placeholder { color:var(--muted); }
        .form-row select option { background:var(--surface2); }
        .form-row input:focus, .form-row select:focus {
          border-color:var(--pink); box-shadow:0 0 0 3px var(--pink-glow);
        }
        .form-actions { display:flex; gap:0.8rem; align-items:center; }
        .btn-submit {
          background:var(--text); color:var(--bg); border:none;
          padding:0.75rem 2rem; border-radius:50px;
          font-family:'Outfit',sans-serif; font-size:0.93rem; font-weight:700;
          cursor:pointer; transition:opacity 0.2s, transform 0.15s;
        }
        .btn-submit:hover { opacity:0.88; transform:translateY(-1px); }
        .btn-submit:disabled { opacity:0.3; cursor:not-allowed; transform:none; }
        .btn-cancel {
          background:none; border:none; color:var(--muted);
          font-family:'Outfit',sans-serif; font-size:0.88rem; cursor:pointer; padding:0.5rem;
          transition:color 0.2s;
        }
        .btn-cancel:hover { color:var(--pink); }

        /* list */
        .list-header {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:1.2rem;
          animation: fade-up 0.6s 0.25s ease both;
        }
        .list-header h2 { font-size:1.05rem; font-weight:700; opacity:0.85; }
        .pill {
          background:var(--surface2); color:var(--muted2);
          border:1px solid var(--border); border-radius:50px;
          padding:0.2rem 0.75rem; font-size:0.78rem; font-weight:600;
        }
        .grid {
          display:grid; grid-template-columns:repeat(auto-fill,minmax(178px,1fr));
          gap:0.7rem;
          animation: fade-up 0.6s 0.3s ease both;
        }
        .v-card {
          background:var(--surface); border:1px solid var(--border);
          border-radius:14px; padding:1rem 1.1rem;
          transition:border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          animation: pop-in 0.3s ease;
        }
        .v-card:hover {
          border-color:var(--pink); transform:translateY(-3px) scale(1.02);
          box-shadow:0 8px 28px var(--pink-glow);
        }
        .v-card:nth-child(4n):hover { border-color:var(--purple); box-shadow:0 8px 28px rgba(192,132,252,0.12); }
        .v-card.first .v-name::before { content:'👑 '; }
        .v-name { font-weight:700; font-size:0.92rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .v-country { font-size:0.8rem; color:var(--muted2); margin-top:0.25rem; }
        .v-id { font-size:0.7rem; color:var(--muted); margin-top:0.3rem; font-family:'Noto Serif JP',serif; }
        .empty {
          text-align:center; padding:4rem; color:var(--muted); font-size:0.93rem;
          background:var(--surface); border:1px dashed var(--border); border-radius:20px;
        }

        @media (max-width:620px) {
          .hero { grid-template-columns:1fr; }
          .girl-wrap { width:220px; height:350px; margin:0 auto; }
          .stats { flex-direction:column; }
        }
      `}</style>

      <div className="scanline" />
      {petals.map((p, i) => <Petal key={i} {...p} />)}

      <div className="page">
        <div className="topbar">
          <span className="logo">ゲストブック · guestbook</span>
          <div className="live"><span className="live-dot" />backend online</div>
        </div>

        <div className="hero">
          <div>
            <h1 className="hero-title">
              <span className="t1">who's</span>
              <span className="t2">visiting?</span>
            </h1>
            <p className="hero-sub">A silly guestbook for people who somehow ended up here. Sign it. You've got nothing better to do anyway 🙂</p>
            <p className="hero-hint">↓ click her, she reacts 👀</p>
          </div>

          <div className="girl-wrap" onClick={handleGirlClick}>
            {girlMsgVisible && <div className="girl-msg">{girlMsg}</div>}
            <AnimeGirl />
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="val">{visitors.length}</div>
            <div className="lbl">total lost souls</div>
          </div>
          <div className="stat">
            <div className="val">{new Set(visitors.map(v => v.country)).size || 0}</div>
            <div className="lbl">countries</div>
          </div>
          <div className="stat">
            <div className="val">{visitors.length > 0 ? `#${visitors[0].id}` : "—"}</div>
            <div className="lbl">latest id</div>
          </div>
        </div>

        <div className="roast">
          <strong>bro... you actually found this page? 💀</strong> out of everything you could be doing right now — you ended up HERE. no job? no hobbies? no grass to touch?
          <span className="soft">okay okay I'm joking 😭 welcome!! since you're here, sign the guestbook like a decent person 🌸</span>
        </div>

        <div className="cta-zone">
          {submitted && <div className="success-bar">✦ you're in the guestbook now. welcome to the club 🎉</div>}
          {!showForm && !submitted && (
            <button className="cta-btn" onClick={() => setShowForm(true)}>✍ sign the guestbook</button>
          )}
          {showForm && (
            <div className="form-card">
              <h3>who are you, mystery visitor?</h3>
              <div className="form-row">
                <input placeholder="your name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                <select value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="">select country...</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-actions">
                <button className="btn-submit" onClick={handleSubmit} disabled={loading || !name.trim() || !country}>
                  {loading ? "saving..." : "add me →"}
                </button>
                <button className="btn-cancel" onClick={() => setShowForm(false)}>cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="list-header">
          <h2>guestbook</h2>
          <span className="pill">{visitors.length} people</span>
        </div>
        {visitors.length === 0 ? (
          <div className="empty">no visitors yet... be the first one 👀</div>
        ) : (
          <div className="grid">
            {visitors.map((v, i) => (
              <div className={`v-card${i === visitors.length - 1 ? " first" : ""}`} key={v.id}>
                <div className="v-name">{v.name}</div>
                <div className="v-country">🌍 {v.country}</div>
                <div className="v-id">#{v.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
