import { useState, useEffect } from "react";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = {
  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async select(table) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async update(table, id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

const SQL_SETUP = `-- Run this in your Supabase SQL editor:
CREATE TABLE crush_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  applicant_name text NOT NULL,
  applicant_age integer,
  applicant_pronouns text,
  crush_name text NOT NULL,
  relationship_status text,
  how_long_known text,
  crush_awareness text,
  rizz_rating integer,
  red_flags text[],
  green_flags text[],
  love_languages text[],
  elevator_pitch text,
  worst_trait text,
  embarrassing_story text,
  theme_song text,
  dealbreakers text,
  references_provided boolean DEFAULT false,
  status text DEFAULT 'pending',
  reviewer_notes text
);

ALTER TABLE crush_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON crush_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read" ON crush_applications FOR SELECT USING (true);
CREATE POLICY "Anyone can update" ON crush_applications FOR UPDATE USING (true);`;

const STEPS = [
  { id: 1, title: "Basic Info", icon: "📋", subtitle: "Tell us who you are" },
  { id: 2, title: "The Crush", icon: "💘", subtitle: "About the lucky person" },
  { id: 3, title: "Compatibility", icon: "🔬", subtitle: "Scientific analysis" },
  { id: 4, title: "Self-Assessment", icon: "🪞", subtitle: "Brutal honesty required" },
  { id: 5, title: "Final Plea", icon: "🙏", subtitle: "Your closing argument" },
];

const RED_FLAGS = ["Ghosts people", "Bad tipper", "Rude to waitstaff", "Never updates apps", "Loud chewer", "Talks in movies", "Sends voice notes unprompted", "No punctuation ever"];
const GREEN_FLAGS = ["Makes their bed", "Reads books", "Remembers small details", "Good with animals", "Admits when wrong", "Laughs at themselves", "Responds within 24h", "Has hobbies"];
const LOVE_LANGS = ["Words of affirmation", "Acts of service", "Gift giving", "Quality time", "Physical touch"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #fdf6f0;
    min-height: 100vh;
    color: #1a1a1a;
  }

  .app {
    min-height: 100vh;
    background: #fdf6f0;
  }

  .hero {
    background: #1a1a1a;
    color: #fdf6f0;
    padding: 3rem 2rem 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(255,182,193,0.04) 40px,
      rgba(255,182,193,0.04) 80px
    );
  }

  .hero-badge {
    display: inline-block;
    background: #ff6b8a;
    color: white;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 20px;
    margin-bottom: 1.5rem;
  }

  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 1rem;
  }

  .hero h1 em {
    font-style: italic;
    color: #ff6b8a;
  }

  .hero p {
    font-size: 1rem;
    color: rgba(253,246,240,0.65);
    max-width: 480px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    flex-wrap: wrap;
  }

  .stat {
    text-align: center;
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #ff6b8a;
  }

  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(253,246,240,0.5);
    margin-top: 2px;
  }

  .main {
    max-width: 720px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  .steps-bar {
    display: flex;
    gap: 0;
    margin-bottom: 2.5rem;
    border: 1.5px solid #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
  }

  .step-dot {
    flex: 1;
    padding: 10px 6px;
    text-align: center;
    cursor: pointer;
    background: white;
    border-right: 1.5px solid #1a1a1a;
    transition: background 0.2s;
    position: relative;
  }

  .step-dot:last-child { border-right: none; }

  .step-dot.active { background: #1a1a1a; color: #fdf6f0; }
  .step-dot.done { background: #ff6b8a; color: white; }

  .step-dot-icon { font-size: 1.2rem; display: block; }
  .step-dot-label { font-size: 9px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 2px; opacity: 0.8; }

  .card {
    background: white;
    border: 1.5px solid #1a1a1a;
    border-radius: 16px;
    padding: 2rem 2rem;
    margin-bottom: 1.5rem;
  }

  .card-header {
    margin-bottom: 1.8rem;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid #f0e8e0;
  }

  .card-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .card-header p {
    font-size: 0.875rem;
    color: #888;
    margin-top: 4px;
  }

  .field {
    margin-bottom: 1.4rem;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }

  label .req { color: #ff6b8a; margin-left: 2px; }
  label .hint { color: #aaa; font-weight: 400; font-style: italic; margin-left: 6px; }

  input[type="text"], input[type="number"], select, textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a1a1a;
    background: #fafafa;
    transition: border-color 0.2s, background 0.2s;
    outline: none;
  }

  input:focus, select:focus, textarea:focus {
    border-color: #ff6b8a;
    background: white;
  }

  textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }

  .chip {
    padding: 6px 14px;
    border: 1.5px solid #ddd;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    background: white;
    color: #555;
    user-select: none;
  }

  .chip:hover { border-color: #ff6b8a; color: #ff6b8a; }

  .chip.selected-red { background: #ff6b8a; border-color: #ff6b8a; color: white; }
  .chip.selected-green { background: #4aba87; border-color: #4aba87; color: white; }
  .chip.selected-blue { background: #5b8ff9; border-color: #5b8ff9; color: white; }

  .rizz-track {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .rizz-btn {
    flex: 1;
    padding: 8px 4px;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    background: white;
    font-size: 12px;
    font-weight: 500;
    color: #888;
    transition: all 0.15s;
  }

  .rizz-btn:hover { border-color: #ff6b8a; }
  .rizz-btn.sel { background: #1a1a1a; border-color: #1a1a1a; color: #fdf6f0; }

  .rizz-label {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #bbb;
    margin-top: 4px;
    padding: 0 2px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .nav-btns {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .btn {
    padding: 12px 28px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    border: 1.5px solid #1a1a1a;
  }

  .btn-outline {
    background: white;
    color: #1a1a1a;
  }
  .btn-outline:hover { background: #f0e8e0; }

  .btn-primary {
    background: #1a1a1a;
    color: white;
  }
  .btn-primary:hover { background: #333; }

  .btn-pink {
    background: #ff6b8a;
    color: white;
    border-color: #ff6b8a;
    font-size: 15px;
    padding: 14px 32px;
    width: 100%;
  }
  .btn-pink:hover { background: #e85577; }

  .success-screen {
    text-align: center;
    padding: 4rem 2rem;
  }

  .success-icon { font-size: 4rem; margin-bottom: 1rem; }

  .success-screen h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  .success-screen p {
    color: #777;
    line-height: 1.7;
    max-width: 420px;
    margin: 0 auto 1.5rem;
  }

  .case-number {
    display: inline-block;
    background: #1a1a1a;
    color: #fdf6f0;
    padding: 8px 20px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 14px;
    letter-spacing: 0.1em;
    margin-bottom: 2rem;
  }

  .disclaimer {
    background: #fff8f0;
    border: 1px solid #f0dcc8;
    border-radius: 10px;
    padding: 1rem 1.2rem;
    font-size: 12px;
    color: #997755;
    line-height: 1.7;
    margin-top: 0.5rem;
  }

  .admin-panel {
    background: #1a1a1a;
    color: #fdf6f0;
    min-height: 100vh;
    padding: 2rem;
  }

  .admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #333;
  }

  .admin-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
  }

  .app-card {
    background: #252525;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.2rem 1.4rem;
    margin-bottom: 1rem;
  }

  .app-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.8rem;
  }

  .app-card h3 { font-size: 1rem; font-weight: 500; }
  .app-card .meta { font-size: 12px; color: #888; margin-top: 2px; }

  .status-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .status-pending { background: #3a3000; color: #ffc94d; }
  .status-approved { background: #003a1a; color: #4aba87; }
  .status-rejected { background: #3a0010; color: #ff6b8a; }

  .app-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    font-size: 13px;
    color: #aaa;
    margin-top: 0.8rem;
  }

  .app-detail strong { color: #fdf6f0; }

  .admin-actions { display: flex; gap: 8px; margin-top: 1rem; }

  .btn-sm {
    padding: 6px 14px;
    font-size: 12px;
    border-radius: 6px;
    border: 1px solid;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    transition: opacity 0.15s;
  }
  .btn-sm:hover { opacity: 0.8; }
  .btn-approve { background: transparent; border-color: #4aba87; color: #4aba87; }
  .btn-reject { background: transparent; border-color: #ff6b8a; color: #ff6b8a; }
  .btn-pending { background: transparent; border-color: #ffc94d; color: #ffc94d; }

  .empty { text-align: center; color: #555; padding: 3rem; }

  .setup-box {
    background: #1a1a1a;
    color: #fdf6f0;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .setup-box h3 {
    font-family: 'Playfair Display', serif;
    margin-bottom: 0.8rem;
    color: #ff6b8a;
  }

  .setup-box pre {
    background: #111;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    font-size: 11px;
    overflow-x: auto;
    color: #aaffaa;
    line-height: 1.6;
    margin: 0.8rem 0;
    white-space: pre;
  }

  .setup-box .fields { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1rem; }

  .setup-box input {
    background: #252525;
    border: 1px solid #444;
    color: #fdf6f0;
    border-radius: 8px;
    padding: 10px 14px;
    font-family: monospace;
    font-size: 13px;
    width: 100%;
    outline: none;
  }

  .setup-box input::placeholder { color: #555; }
  .setup-box input:focus { border-color: #ff6b8a; }

  .tabs {
    display: flex;
    gap: 0;
    margin-bottom: 2rem;
    border: 1.5px solid #1a1a1a;
    border-radius: 10px;
    overflow: hidden;
    width: fit-content;
  }

  .tab {
    padding: 10px 22px;
    background: white;
    border-right: 1.5px solid #1a1a1a;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: #666;
    transition: all 0.15s;
  }
  .tab:last-child { border-right: none; }
  .tab:hover { background: #f5ede6; }
  .tab.active { background: #1a1a1a; color: white; }

  .pitch-tips {
    font-size: 11px;
    color: #aaa;
    margin-top: 6px;
    font-style: italic;
  }

  @media (max-width: 520px) {
    .row { grid-template-columns: 1fr; }
    .hero h1 { font-size: 2rem; }
    .app-detail { grid-template-columns: 1fr; }
  }
`;

const RIZZ_LABELS = ["Chronically Offline", "Mid", "Decent", "Actually Rizzy", "Certified Sigma", "Aura Overlord"];

export default function App() {
  const [view, setView] = useState("form");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [sbUrl, setSbUrl] = useState(SUPABASE_URL);
  const [sbKey, setSbKey] = useState(SUPABASE_ANON_KEY);
  const [configured, setConfigured] = useState(false);

  const [form, setForm] = useState({
    applicant_name: "",
    applicant_age: "",
    applicant_pronouns: "",
    crush_name: "",
    relationship_status: "single",
    how_long_known: "",
    crush_awareness: "oblivious",
    rizz_rating: null,
    red_flags: [],
    green_flags: [],
    love_languages: [],
    elevator_pitch: "",
    worst_trait: "",
    embarrassing_story: "",
    theme_song: "",
    dealbreakers: "",
    references_provided: false,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleChip = (field, val) =>
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
    }));

  const getSupa = () => ({
    async insert(table, data) {
      const res = await fetch(`${sbUrl}/rest/v1/${table}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": sbKey,
          "Authorization": `Bearer ${sbKey}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async select(table) {
      const res = await fetch(`${sbUrl}/rest/v1/${table}?select=*&order=created_at.desc`, {
        headers: { "apikey": sbKey, "Authorization": `Bearer ${sbKey}` }
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async update(table, id, data) {
      const res = await fetch(`${sbUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": sbKey,
          "Authorization": `Bearer ${sbKey}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }
  });

  const handleSubmit = async () => {
    if (!form.applicant_name || !form.crush_name) { setError("Applicant name and crush name are required."); return; }
    setSubmitting(true);
    setError("");
    try {
      const db = getSupa();
      const rows = await db.insert("crush_applications", {
        ...form,
        applicant_age: form.applicant_age ? parseInt(form.applicant_age) : null,
        rizz_rating: form.rizz_rating,
        red_flags: form.red_flags,
        green_flags: form.green_flags,
        love_languages: form.love_languages,
        status: "pending",
      });
      setCaseId("CA-" + rows[0].id.slice(0, 8).toUpperCase());
      setSubmitted(true);
    } catch (e) {
      setError("Failed to submit: " + e.message + ". Check your Supabase credentials and table setup.");
    }
    setSubmitting(false);
  };

  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const db = getSupa();
      const rows = await db.select("crush_applications");
      setApplications(rows);
    } catch (e) {
      setError("Failed to load: " + e.message);
    }
    setLoadingApps(false);
  };

  const updateStatus = async (id, status) => {
    try {
      const db = getSupa();
      await db.update("crush_applications", id, { status });
      setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) {}
  };

  useEffect(() => {
    if (view === "admin" && configured) loadApplications();
  }, [view, configured]);

  const canProceed = () => {
    if (step === 1) return form.applicant_name.trim() !== "";
    if (step === 2) return form.crush_name.trim() !== "";
    return true;
  };

  const statusCounts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {view === "admin" ? (
          <div className="admin-panel">
            <div className="admin-header">
              <div>
                <h2>💘 Applications Dashboard</h2>
                <p style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>Review incoming crush applications</p>
              </div>
              <button className="btn btn-outline" style={{ background: "transparent", color: "#fdf6f0", borderColor: "#444" }} onClick={() => setView("form")}>
                ← Back to Form
              </button>
            </div>

            {!configured && (
              <div style={{ background: "#252525", border: "1px solid #444", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <p style={{ color: "#ff6b8a", fontWeight: 500, marginBottom: "0.8rem" }}>⚙️ Configure Supabase</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <input style={{ background: "#1a1a1a", border: "1px solid #444", color: "#fdf6f0", borderRadius: "8px", padding: "10px 14px", fontFamily: "monospace", fontSize: "13px", outline: "none" }} placeholder="Supabase URL (https://xxx.supabase.co)" value={sbUrl === "YOUR_SUPABASE_URL" ? "" : sbUrl} onChange={e => setSbUrl(e.target.value)} />
                  <input style={{ background: "#1a1a1a", border: "1px solid #444", color: "#fdf6f0", borderRadius: "8px", padding: "10px 14px", fontFamily: "monospace", fontSize: "13px", outline: "none" }} placeholder="Supabase Anon Key" value={sbKey === "YOUR_SUPABASE_ANON_KEY" ? "" : sbKey} onChange={e => setSbKey(e.target.value)} />
                  <button onClick={() => { setConfigured(true); loadApplications(); }} style={{ background: "#ff6b8a", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px", alignSelf: "flex-start" }}>Connect & Load</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {[["Total", applications.length, "#5b8ff9"], ["Pending", statusCounts.pending || 0, "#ffc94d"], ["Approved", statusCounts.approved || 0, "#4aba87"], ["Rejected", statusCounts.rejected || 0, "#ff6b8a"]].map(([label, count, color]) => (
                <div key={label} style={{ background: "#252525", border: "1px solid #333", borderRadius: "10px", padding: "1rem 1.5rem", minWidth: "100px" }}>
                  <div style={{ fontSize: "1.6rem", fontFamily: "'Playfair Display', serif", color }}>{count}</div>
                  <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                </div>
              ))}
              {configured && <button onClick={loadApplications} style={{ background: "transparent", border: "1px solid #444", color: "#888", borderRadius: "10px", padding: "0.8rem 1.2rem", cursor: "pointer", fontSize: "13px" }}>↻ Refresh</button>}
            </div>

            {error && <div style={{ color: "#ff6b8a", marginBottom: "1rem", fontSize: "13px" }}>{error}</div>}
            {loadingApps && <div className="empty">Loading applications...</div>}
            {!loadingApps && applications.length === 0 && configured && <div className="empty">No applications yet. Share the form link!</div>}

            {applications.map(app => (
              <div key={app.id} className="app-card">
                <div className="app-card-header">
                  <div>
                    <h3>{app.applicant_name} <span style={{ color: "#ff6b8a" }}>→</span> {app.crush_name}</h3>
                    <div className="meta">
                      Case #{app.id.slice(0, 8).toUpperCase()} · {app.applicant_pronouns || "—"} · Age {app.applicant_age || "?"} · {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`status-badge status-${app.status}`}>{app.status}</span>
                </div>
                <div className="app-detail">
                  <div><strong>Known for:</strong> {app.how_long_known || "—"}</div>
                  <div><strong>Crush awareness:</strong> {app.crush_awareness}</div>
                  <div><strong>Rizz rating:</strong> {app.rizz_rating ? `${app.rizz_rating}/6 (${RIZZ_LABELS[(app.rizz_rating || 1) - 1]})` : "—"}</div>
                  <div><strong>Love langs:</strong> {app.love_languages?.join(", ") || "—"}</div>
                  <div><strong>Red flags:</strong> {app.red_flags?.join(", ") || "None checked"}</div>
                  <div><strong>Green flags:</strong> {app.green_flags?.join(", ") || "None checked"}</div>
                </div>
                {app.elevator_pitch && (
                  <div style={{ marginTop: "0.8rem", background: "#1a1a1a", borderRadius: "8px", padding: "0.8rem 1rem", fontSize: "13px", color: "#ccc", fontStyle: "italic" }}>
                    "{app.elevator_pitch}"
                  </div>
                )}
                {app.worst_trait && <div style={{ fontSize: "12px", color: "#888", marginTop: "0.5rem" }}>⚠️ Worst trait: {app.worst_trait}</div>}
                {app.theme_song && <div style={{ fontSize: "12px", color: "#888", marginTop: "3px" }}>🎵 Theme song: {app.theme_song}</div>}
                <div className="admin-actions">
                  <button className="btn-sm btn-approve" onClick={() => updateStatus(app.id, "approved")}>✓ Approve</button>
                  <button className="btn-sm btn-reject" onClick={() => updateStatus(app.id, "rejected")}>✗ Reject</button>
                  <button className="btn-sm btn-pending" onClick={() => updateStatus(app.id, "pending")}>⏳ Pending</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="hero">
              <div className="hero-badge">💘 Official Application</div>
              <h1>Apply to Be<br />Someone's <em>Crush</em></h1>
              <p>All applications reviewed by our highly qualified panel of romantics, cynics, and one very opinionated cat.</p>
              <div className="hero-stats">
                <div className="stat"><div className="stat-num">94%</div><div className="stat-label">Rejection rate</div></div>
                <div className="stat"><div className="stat-num">3-5</div><div className="stat-label">Business feelings</div></div>
                <div className="stat"><div className="stat-num">∞</div><div className="stat-label">Red flags ignored</div></div>
              </div>
            </div>

            <div className="main">
              {!submitted ? (
                <>
                  {(sbUrl === "YOUR_SUPABASE_URL" || sbKey === "YOUR_SUPABASE_ANON_KEY") && (
                    <div className="setup-box">
                      <h3>⚙️ Setup Required</h3>
                      <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "0.8rem" }}>Enter your Supabase credentials to save applications. Create the table first:</p>
                      <pre>{SQL_SETUP}</pre>
                      <div className="fields">
                        <input placeholder="Supabase Project URL (https://xxx.supabase.co)" value={sbUrl === "YOUR_SUPABASE_URL" ? "" : sbUrl} onChange={e => setSbUrl(e.target.value)} />
                        <input placeholder="Supabase Anon Key" value={sbKey === "YOUR_SUPABASE_ANON_KEY" ? "" : sbKey} onChange={e => setSbKey(e.target.value)} />
                        <button onClick={() => setConfigured(true)} style={{ background: "#ff6b8a", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px", alignSelf: "flex-start" }}>Save Credentials</button>
                      </div>
                    </div>
                  )}

                  <div className="tabs">
                    <div className={`tab ${view === "form" ? "active" : ""}`} onClick={() => setView("form")}>📝 Apply</div>
                    <div className={`tab ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>🗂 Admin</div>
                  </div>

                  <div className="steps-bar">
                    {STEPS.map(s => (
                      <div key={s.id} className={`step-dot ${step === s.id ? "active" : step > s.id ? "done" : ""}`} onClick={() => step > s.id && setStep(s.id)}>
                        <span className="step-dot-icon">{step > s.id ? "✓" : s.icon}</span>
                        <span className="step-dot-label">{s.title}</span>
                      </div>
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="card">
                      <div className="card-header">
                        <h2>📋 Basic Info</h2>
                        <p>This is legally binding. Sort of.</p>
                      </div>
                      <div className="row">
                        <div className="field">
                          <label>Your Full Name <span className="req">*</span></label>
                          <input type="text" placeholder="As it appears on your therapy bills" value={form.applicant_name} onChange={e => set("applicant_name", e.target.value)} />
                        </div>
                        <div className="field">
                          <label>Age <span className="hint">(over 18 only)</span></label>
                          <input type="number" placeholder="Real one" min={18} max={120} value={form.applicant_age} onChange={e => set("applicant_age", e.target.value)} />
                        </div>
                      </div>
                      <div className="field">
                        <label>Pronouns <span className="hint">(optional but appreciated)</span></label>
                        <input type="text" placeholder="e.g. she/her, he/him, they/them, disaster/catastrophe" value={form.applicant_pronouns} onChange={e => set("applicant_pronouns", e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Current Relationship Status</label>
                        <select value={form.relationship_status} onChange={e => set("relationship_status", e.target.value)}>
                          <option value="single">Single (finally free)</option>
                          <option value="complicated">It's complicated</option>
                          <option value="situationship">Deep in a situationship</option>
                          <option value="recovering">Recovering from something</option>
                          <option value="happily_single">Happily single but here anyway</option>
                        </select>
                      </div>
                      <div className="disclaimer">
                        ⚖️ <strong>Legal notice:</strong> By proceeding you confirm you are applying in good faith and accept that rejection is a completely valid outcome. No refunds on emotions.
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="card">
                      <div className="card-header">
                        <h2>💘 About Your Crush</h2>
                        <p>The person in question. No last names needed (for their protection).</p>
                      </div>
                      <div className="field">
                        <label>Crush's Name / Nickname <span className="req">*</span></label>
                        <input type="text" placeholder="The reason you check your phone every 3 minutes" value={form.crush_name} onChange={e => set("crush_name", e.target.value)} />
                      </div>
                      <div className="field">
                        <label>How long have you known them?</label>
                        <select value={form.how_long_known} onChange={e => set("how_long_known", e.target.value)}>
                          <option value="">Select...</option>
                          <option value="just_met">Just met (brave)</option>
                          <option value="weeks">A few weeks</option>
                          <option value="months">Several months</option>
                          <option value="years">Years (saying nothing is a skill)</option>
                          <option value="childhood">Since childhood (wow)</option>
                          <option value="internet">Only online (valid)</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Do they know you exist in this way?</label>
                        <select value={form.crush_awareness} onChange={e => set("crush_awareness", e.target.value)}>
                          <option value="oblivious">Completely oblivious</option>
                          <option value="maybe">Maybe slightly suspects</option>
                          <option value="mutual_vibe">There's definitely a vibe</option>
                          <option value="they_know">They absolutely know</option>
                          <option value="they_told_me">They literally told me</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Documented Red Flags <span className="hint">(be honest)</span></label>
                        <div className="chips">
                          {RED_FLAGS.map(f => (
                            <div key={f} className={`chip ${form.red_flags.includes(f) ? "selected-red" : ""}`} onClick={() => toggleChip("red_flags", f)}>{f}</div>
                          ))}
                        </div>
                      </div>
                      <div className="field">
                        <label>Verified Green Flags <span className="hint">(the reasons you're still here)</span></label>
                        <div className="chips">
                          {GREEN_FLAGS.map(f => (
                            <div key={f} className={`chip ${form.green_flags.includes(f) ? "selected-green" : ""}`} onClick={() => toggleChip("green_flags", f)}>{f}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="card">
                      <div className="card-header">
                        <h2>🔬 Compatibility Analysis</h2>
                        <p>Peer-reviewed by no one. Results may vary.</p>
                      </div>
                      <div className="field">
                        <label>Your Rizz Level™</label>
                        <div className="rizz-track">
                          {RIZZ_LABELS.map((l, i) => (
                            <div key={i} className={`rizz-btn ${form.rizz_rating === i + 1 ? "sel" : ""}`} onClick={() => set("rizz_rating", i + 1)}>{i + 1}</div>
                          ))}
                        </div>
                        <div className="rizz-label"><span>Zero rizz</span><span>Unmatched aura</span></div>
                        {form.rizz_rating && <p style={{ fontSize: "12px", color: "#ff6b8a", marginTop: "6px" }}>Verdict: {RIZZ_LABELS[form.rizz_rating - 1]}</p>}
                      </div>
                      <div className="field">
                        <label>Your Love Language(s) <span className="hint">(select all that apply)</span></label>
                        <div className="chips">
                          {LOVE_LANGS.map(l => (
                            <div key={l} className={`chip ${form.love_languages.includes(l) ? "selected-blue" : ""}`} onClick={() => toggleChip("love_languages", l)}>{l}</div>
                          ))}
                        </div>
                      </div>
                      <div className="field">
                        <label>Your Dealbreakers</label>
                        <textarea placeholder="What would immediately end your pursuit? (Be specific. We take this very seriously.)" value={form.dealbreakers} onChange={e => set("dealbreakers", e.target.value)} />
                      </div>
                      <div className="field" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input type="checkbox" id="refs" checked={form.references_provided} onChange={e => set("references_provided", e.target.checked)} style={{ width: "auto" }} />
                        <label htmlFor="refs" style={{ margin: 0 }}>I have at least two references who will vouch for my character <span className="hint">(exes don't count)</span></label>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="card">
                      <div className="card-header">
                        <h2>🪞 Self-Assessment</h2>
                        <p>Honesty is attractive. Allegedly.</p>
                      </div>
                      <div className="field">
                        <label>Your single worst trait <span className="req">*</span> <span className="hint">(we will find out anyway)</span></label>
                        <input type="text" placeholder="E.g. I send 9-paragraph texts, I'm always 7 minutes late, I cry at commercials" value={form.worst_trait} onChange={e => set("worst_trait", e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Most embarrassing thing that could come up</label>
                        <textarea placeholder="Background check is thorough. Tell us first." value={form.embarrassing_story} onChange={e => set("embarrassing_story", e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Your relationship theme song</label>
                        <input type="text" placeholder="The song that plays in your head when you see them" value={form.theme_song} onChange={e => set("theme_song", e.target.value)} />
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="card">
                      <div className="card-header">
                        <h2>🙏 Final Plea</h2>
                        <p>Your closing argument. Make it count.</p>
                      </div>
                      <div className="field">
                        <label>The Elevator Pitch <span className="req">*</span></label>
                        <textarea style={{ minHeight: "130px" }} placeholder="Why should you get the opportunity? You have 30 seconds (metaphorically). Impress us." value={form.elevator_pitch} onChange={e => set("elevator_pitch", e.target.value)} />
                        <p className="pitch-tips">Tips: Lead with your strongest quality. Acknowledge your flaws briefly. End with a call to action. Avoid mentioning your ex.</p>
                      </div>
                      {error && <div style={{ color: "#c0392b", fontSize: "13px", marginBottom: "0.8rem", padding: "10px 14px", background: "#fdf0f0", borderRadius: "8px", border: "1px solid #f5c6c6" }}>{error}</div>}
                      <button className="btn btn-pink" disabled={submitting} onClick={handleSubmit}>
                        {submitting ? "Submitting your feelings... 💌" : "Submit Application 💘"}
                      </button>
                      <div className="disclaimer" style={{ marginTop: "1rem" }}>
                        🔒 Your application is stored securely and reviewed with the gravity it deserves. Allow 3–5 business feelings for a response. Approval does not guarantee reciprocation.
                      </div>
                    </div>
                  )}

                  <div className="nav-btns">
                    {step > 1 ? (
                      <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>← Back</button>
                    ) : <div />}
                    {step < 5 && (
                      <button className="btn btn-primary" disabled={!canProceed()} onClick={() => setStep(s => s + 1)}>
                        Next →
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="success-screen">
                  <div className="success-icon">💌</div>
                  <h2>Application Received</h2>
                  <p>Your feelings have been officially documented and will be reviewed by our panel at their earliest convenience.</p>
                  <div className="case-number">{caseId}</div>
                  <p style={{ fontSize: "13px" }}>Keep this case number for your records. You'll need it if you want to escalate to a formal declaration.</p>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
                    <button className="btn btn-outline" onClick={() => { setSubmitted(false); setStep(1); setForm({ applicant_name: "", applicant_age: "", applicant_pronouns: "", crush_name: "", relationship_status: "single", how_long_known: "", crush_awareness: "oblivious", rizz_rating: null, red_flags: [], green_flags: [], love_languages: [], elevator_pitch: "", worst_trait: "", embarrassing_story: "", theme_song: "", dealbreakers: "", references_provided: false }); }}>
                      Apply for another crush
                    </button>
                    <button className="btn btn-primary" onClick={() => setView("admin")}>View All Applications</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
