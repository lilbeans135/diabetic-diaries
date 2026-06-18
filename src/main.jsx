import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BookHeart,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Droplets,
  HeartPulse,
  Home,
  ImagePlus,
  KeyRound,
  Lock,
  LockKeyhole,
  NotebookPen,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "diabetic-diaries-v1";
const PASSWORD_KEY = "diabetic-diaries-password";
const SESSION_KEY = "diabetic-diaries-unlocked";
const PROFILE_KEY = "diabetic-diaries-profile";

const defaultProfile = {
  name: "",
  initials: "DD",
  diabetesType: "Prefer not to say",
  glucoseUnit: "mg/dL",
  careNote: "",
  avatarColor: "peach",
};

const STICKER_PACKS = {
  glucose: [
    { id: "berry-drop", art: "🫐", face: "˶ᵔ ᵕ ᵔ˶", label: "Berry drop", color: "lilac" },
    { id: "sunny-meter", art: "☀️", face: "Good job!", label: "Sunny meter", color: "yellow" },
    { id: "sweet-pea", art: "🫛", face: "steady", label: "Sweet pea", color: "green" },
    { id: "tiny-toast", art: "🍞", face: "checked!", label: "Tiny toast", color: "peach" },
    { id: "moon-drop", art: "🌙", face: "rest easy", label: "Moon drop", color: "blue" },
    { id: "brave-drop", art: "💧", face: "so brave", label: "Brave drop", color: "pink" },
  ],
  pressure: [
    { id: "heart-hug", art: "💗", face: "breathe", label: "Heart hug", color: "pink" },
    { id: "cloud-calm", art: "☁️", face: "slow & soft", label: "Calm cloud", color: "blue" },
    { id: "tea-break", art: "🍵", face: "take five", label: "Tea break", color: "green" },
    { id: "cozy-pulse", art: "🧸", face: "you've got this", label: "Cozy pulse", color: "peach" },
    { id: "little-leaf", art: "🍃", face: "inhale", label: "Little leaf", color: "mint" },
    { id: "heart-star", art: "⭐", face: "nice check!", label: "Heart star", color: "yellow" },
  ],
  note: [
    { id: "tiny-win", art: "🏆", face: "tiny win!", label: "Tiny win", color: "yellow" },
    { id: "good-day", art: "🌼", face: "a good day", label: "Good day", color: "peach" },
    { id: "cozy-home", art: "🏡", face: "homebody", label: "Cozy home", color: "green" },
    { id: "little-treat", art: "🍓", face: "little treat", label: "Little treat", color: "pink" },
    { id: "rainy-note", art: "🌧️", face: "soft day", label: "Rainy note", color: "blue" },
    { id: "memory-star", art: "✨", face: "keep this", label: "Memory star", color: "lilac" },
  ],
};

const starterEntries = [
  {
    id: "welcome",
    type: "note",
    date: new Date().toISOString(),
    title: "A small beginning",
    note: "This is your space for the numbers, the memories, and everything in between.",
    mood: "☀️",
  },
];

const formatDay = (date) =>
  new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(date);

const formatTime = (value) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));

const formatShortDate = (value) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));

function loadEntries() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) && stored.length ? stored : starterEntries;
  } catch {
    return starterEntries;
  }
}

function loadProfile() {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(PROFILE_KEY)) };
  } catch {
    return defaultProfile;
  }
}

function App() {
  const [hasPassword, setHasPassword] = useState(Boolean(localStorage.getItem(PASSWORD_KEY)));
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem(SESSION_KEY) === "true");
  const [entries, setEntries] = useState(loadEntries);
  const [profile, setProfile] = useState(loadProfile);
  const [tab, setTab] = useState("today");
  const [composer, setComposer] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const today = new Date();

  const saveEntries = (next) => {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addEntry = (entry) => {
    saveEntries([{ ...entry, id: crypto.randomUUID(), date: new Date().toISOString() }, ...entries]);
    setComposer(null);
  };

  const removeEntry = (id) => saveEntries(entries.filter((entry) => entry.id !== id));

  const glucoseEntries = entries.filter((entry) => entry.type === "glucose");
  const pressureEntries = entries.filter((entry) => entry.type === "pressure");
  const latestGlucose = glucoseEntries[0];
  const latestPressure = pressureEntries[0];

  if (!hasPassword || !unlocked) {
    return (
      <PasswordGate
        hasPassword={hasPassword}
        onSetup={() => setHasPassword(true)}
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  const lockDiary = () => {
    setShowProfile(false);
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  const saveProfile = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
    setShowProfile(false);
  };

  return (
    <div className="app-shell">
      <main className="app">
        <header className="topbar">
          <div>
            <p className="eyebrow">{formatDay(today)}</p>
            <h1>{tab === "today" ? "Your little archive" : tab === "history" ? "Memory drawer" : "Your patterns"}</h1>
          </div>
          <button className={`avatar profile-avatar ${profile.avatarColor}`} onClick={() => setShowProfile(true)} aria-label="Open profile">
            {profile.initials || "DD"}
          </button>
        </header>

        {tab === "today" && (
          <Today
            entries={entries}
            latestGlucose={latestGlucose}
            latestPressure={latestPressure}
            openComposer={setComposer}
            removeEntry={removeEntry}
            profile={profile}
          />
        )}
        {tab === "history" && <History entries={entries} removeEntry={removeEntry} unit={profile.glucoseUnit} />}
        {tab === "trends" && <Trends glucose={glucoseEntries} pressure={pressureEntries} unit={profile.glucoseUnit} />}

        <nav className="bottom-nav" aria-label="Main navigation">
          <NavButton active={tab === "today"} onClick={() => setTab("today")} icon={<Home />} label="Today" />
          <NavButton active={tab === "history"} onClick={() => setTab("history")} icon={<CalendarDays />} label="Archive" />
          <button className="main-add" onClick={() => setComposer("menu")} aria-label="Add an entry"><Plus /></button>
          <NavButton active={tab === "trends"} onClick={() => setTab("trends")} icon={<Activity />} label="Trends" />
          <NavButton active={false} onClick={() => setComposer("note")} icon={<NotebookPen />} label="Write" />
        </nav>
      </main>

      {composer && <Composer type={composer} setType={setComposer} onClose={() => setComposer(null)} onSave={addEntry} unit={profile.glucoseUnit} />}
      {showProfile && <ProfileSheet profile={profile} onSave={saveProfile} onClose={() => setShowProfile(false)} onLock={lockDiary} />}
    </div>
  );
}

function ProfileSheet({ profile, onSave, onClose, onLock }) {
  const [form, setForm] = useState(profile);
  const update = (key, value) => {
    const next = { ...form, [key]: value };
    if (key === "name" && (!form.initials || form.initials === initialsFromName(form.name))) {
      next.initials = initialsFromName(value);
    }
    setForm(next);
  };

  return (
    <div className="modal-layer profile-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="sheet profile-sheet" onSubmit={(event) => { event.preventDefault(); onSave({ ...form, initials: form.initials.trim().slice(0, 3).toUpperCase() || "DD" }); }}>
        <div className="sheet-handle" />
        <button type="button" className="close" onClick={onClose} aria-label="Close profile"><X /></button>

        <div className="profile-cover">
          <div className={`profile-portrait ${form.avatarColor}`}>{form.initials || "DD"}</div>
          <div>
            <p className="eyebrow">MY PRIVATE PROFILE</p>
            <h2>{form.name || "Your name belongs here"}</h2>
            <span><ShieldCheck /> Stored on this device</span>
          </div>
        </div>

        <div className="profile-fields">
          <label><span>NAME</span><input autoFocus value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="What should your diary call you?" /></label>
          <label><span>INITIALS</span><input maxLength="3" value={form.initials} onChange={(event) => update("initials", event.target.value.toUpperCase())} placeholder="DD" /></label>
          <label><span>DIABETES TYPE</span><select value={form.diabetesType} onChange={(event) => update("diabetesType", event.target.value)}><option>Prefer not to say</option><option>Type 1</option><option>Type 2</option><option>Gestational</option><option>Prediabetes</option><option>Other</option></select></label>
          <label><span>GLUCOSE UNIT</span><select value={form.glucoseUnit} onChange={(event) => update("glucoseUnit", event.target.value)}><option>mg/dL</option><option>mmol/L</option></select></label>
        </div>

        <fieldset className="avatar-colors">
          <legend>PROFILE COLOR</legend>
          <div>
            {["peach", "blue", "green", "yellow", "lilac"].map((color) => (
              <button type="button" key={color} className={`${color} ${form.avatarColor === color ? "selected" : ""}`} onClick={() => update("avatarColor", color)} aria-label={`Choose ${color} profile color`} aria-pressed={form.avatarColor === color} />
            ))}
          </div>
        </fieldset>

        <label><span>CARE NOTE <small>(optional)</small></span><textarea rows="3" value={form.careNote} onChange={(event) => update("careNote", event.target.value)} placeholder="Anything you'd like to keep close—your routine, a reminder, or an encouraging note…" /></label>

        <button className="save-button profile-save"><Save /> Save my profile</button>
        <button type="button" className="lock-diary-button" onClick={onLock}><Lock /> Lock diary now</button>
      </form>
    </div>
  );
}

function initialsFromName(name = "") {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "DD";
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(`diabetic-diaries:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function PasswordGate({ hasPassword, onSetup, onUnlock }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (!hasPassword && password !== confirm) {
      setError("Those passwords don’t match.");
      return;
    }

    setWorking(true);
    const passwordHash = await hashPassword(password);

    if (hasPassword) {
      if (passwordHash !== localStorage.getItem(PASSWORD_KEY)) {
        setError("That password isn’t right. Try again.");
        setWorking(false);
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "true");
      onUnlock();
    } else {
      localStorage.setItem(PASSWORD_KEY, passwordHash);
      sessionStorage.setItem(SESSION_KEY, "true");
      onSetup();
      onUnlock();
    }
    setWorking(false);
  };

  return (
    <div className="lock-page">
      <div className="lock-card">
        <div className="lock-emblem"><LockKeyhole /></div>
        <p className="eyebrow">DIABETIC DIARIES</p>
        <h1>{hasPassword ? "Your diary is tucked away." : "Make this space yours."}</h1>
        <p className="lock-intro">
          {hasPassword
            ? "Enter your password to return to your health notes and everyday memories."
            : "Create a password before you begin. You’ll use it each time a new browser session opens."}
        </p>

        <form onSubmit={submit}>
          <label>
            <span>{hasPassword ? "PASSWORD" : "CREATE A PASSWORD"}</span>
            <div className="password-field"><KeyRound /><input autoFocus type="password" autoComplete={hasPassword ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></div>
          </label>
          {!hasPassword && (
            <label>
              <span>CONFIRM PASSWORD</span>
              <div className="password-field"><KeyRound /><input type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Type it once more" /></div>
            </label>
          )}
          {error && <p className="password-error" role="alert">{error}</p>}
          <button className="unlock-button" disabled={working || !password}>
            <Lock /> {working ? "Checking…" : hasPassword ? "Unlock my diary" : "Protect my diary"}
          </button>
        </form>

        <div className="privacy-note">
          <LockKeyhole />
          <p><strong>Stored only on this device.</strong> This lock discourages casual access, but your local records are not encrypted. Don’t use a password you use elsewhere.</p>
        </div>
        {!hasPassword && <p className="recovery-note">There is no password recovery yet, so keep it somewhere safe.</p>}
      </div>
    </div>
  );
}

function Today({ entries, latestGlucose, latestPressure, openComposer, removeEntry, profile }) {
  return (
    <>
      <section className="greeting">
        <div>
          <span className="tiny-mark">{profile.initials || "DD"}</span>
          <p>Good to see you{profile.name ? `, ${profile.name.split(" ")[0]}` : ""}.</p>
          <h2>How are you feeling today?</h2>
        </div>
        <div className="doodle" aria-hidden="true">✿</div>
      </section>

      <section className="quick-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TODAY'S CHECK-IN</p>
            <h2>Keep the essentials close</h2>
          </div>
          <span className="privacy"><span /> Stored on this device</span>
        </div>
        <div className="health-cards">
          <HealthCard
            className="glucose"
            icon={<Droplets />}
            title="Blood sugar"
            value={latestGlucose ? latestGlucose.value : "—"}
            unit={profile.glucoseUnit}
            meta={latestGlucose ? `${latestGlucose.timing} · ${formatTime(latestGlucose.date)}` : "No reading yet"}
            onClick={() => openComposer("glucose")}
          />
          <HealthCard
            className="pressure"
            icon={<HeartPulse />}
            title="Blood pressure"
            value={latestPressure ? `${latestPressure.systolic}/${latestPressure.diastolic}` : "—"}
            unit="mmHg"
            meta={latestPressure ? `Pulse ${latestPressure.pulse || "—"} · ${formatTime(latestPressure.date)}` : "No reading yet"}
            onClick={() => openComposer("pressure")}
          />
        </div>
      </section>

      <section className="archive-box">
        <div className="box-tabs" aria-hidden="true">
          <span>HEALTH</span><span>LIFE</span><span>SMALL WINS</span>
        </div>
        <div className="box-front">
          <div className="box-label">
            <span>DAILY FILE · {new Date().getFullYear()}</span>
            <strong>Today, in small pieces</strong>
            <p>Numbers matter. So does the story around them.</p>
          </div>
          <button className="write-button" onClick={() => openComposer("note")}><BookHeart /> Write a note</button>
        </div>
      </section>

      <section className="recent">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LATEST PIECES</p>
            <h2>Your day so far</h2>
          </div>
        </div>
        <div className="entry-list">
          {entries.slice(0, 4).map((entry) => <EntryCard key={entry.id} entry={entry} onRemove={removeEntry} unit={profile.glucoseUnit} />)}
        </div>
      </section>
    </>
  );
}

function HealthCard({ icon, title, value, unit, meta, onClick, className }) {
  return (
    <button className={`health-card ${className}`} onClick={onClick}>
      <span className="health-icon">{icon}</span>
      <span className="health-copy">
        <span className="health-title">{title}</span>
        <span className="health-value">{value} <small>{unit}</small></span>
        <span className="health-meta">{meta}</span>
      </span>
      <span className="round-plus"><Plus /></span>
    </button>
  );
}

function EntryCard({ entry, onRemove, unit = "mg/dL" }) {
  const content =
    entry.type === "glucose"
      ? `${entry.value} ${entry.unit || unit} · ${entry.timing}`
      : entry.type === "pressure"
        ? `${entry.systolic}/${entry.diastolic} mmHg${entry.pulse ? ` · Pulse ${entry.pulse}` : ""}`
        : entry.note;
  const icon = entry.type === "glucose" ? <Droplets /> : entry.type === "pressure" ? <HeartPulse /> : <BookHeart />;
  const sticker = STICKER_PACKS[entry.type]?.find((item) => item.id === entry.sticker);

  return (
    <article className={`entry-card ${entry.type}`}>
      {sticker ? <Sticker sticker={sticker} compact /> : <span className="entry-icon">{icon}</span>}
      <div>
        <div className="entry-title">
          <strong>{entry.type === "note" ? entry.title || "Daily note" : entry.type === "glucose" ? "Blood sugar" : "Blood pressure"}</strong>
          <time>{formatTime(entry.date)}</time>
        </div>
        <p>{content}</p>
        {entry.photo && (
          <figure className="entry-photo">
            <img src={entry.photo} alt={entry.photoName ? `Attached memory: ${entry.photoName}` : "Attached life memory"} />
          </figure>
        )}
        {entry.note && entry.type !== "note" && <small>{entry.note}</small>}
      </div>
      {entry.id !== "welcome" && <button className="delete" onClick={() => onRemove(entry.id)} aria-label="Delete entry"><Trash2 /></button>}
    </article>
  );
}

function History({ entries, removeEntry, unit }) {
  const groups = useMemo(() => {
    return entries.reduce((all, entry) => {
      const key = formatShortDate(entry.date);
      all[key] = all[key] || [];
      all[key].push(entry);
      return all;
    }, {});
  }, [entries]);

  return (
    <section className="history-page">
      <div className="month-switcher">
        <button aria-label="Previous month"><ChevronLeft /></button>
        <div><span>YOUR ARCHIVE</span><strong>{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date())}</strong></div>
        <button aria-label="Next month"><ChevronRight /></button>
      </div>
      <div className="drawer">
        <div className="drawer-handle" />
        <div className="drawer-label"><span>DIABETIC DIARIES</span><strong>Health, days & little victories</strong></div>
      </div>
      <div className="history-groups">
        {Object.entries(groups).map(([day, items]) => (
          <div className="day-group" key={day}>
            <div className="day-label"><span>{day.split(" ")[0]}</span><strong>{day.split(" ")[1]}</strong></div>
            <div className="day-entries">{items.map((entry) => <EntryCard key={entry.id} entry={entry} onRemove={removeEntry} unit={unit} />)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Trends({ glucose, pressure, unit }) {
  const glucoseValues = glucose.slice(0, 7).reverse().map((entry) => Number(entry.value));
  const avgGlucose = glucoseValues.length ? Math.round(glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length) : null;
  const pressureValues = pressure.slice(0, 7);
  const avgSys = pressureValues.length ? Math.round(pressureValues.reduce((a, b) => a + Number(b.systolic), 0) / pressureValues.length) : null;
  const avgDia = pressureValues.length ? Math.round(pressureValues.reduce((a, b) => a + Number(b.diastolic), 0) / pressureValues.length) : null;

  return (
    <section className="trends-page">
      <div className="insight-card">
        <div className="insight-top"><span><Sparkles /> A gentle overview</span><small>Last 7 entries</small></div>
        <h2>{glucose.length + pressure.length ? "Your care is adding up." : "Your patterns will live here."}</h2>
        <p>{glucose.length + pressure.length ? "Each check-in gives you a clearer picture to bring to your care team." : "Add a few readings and this page will begin connecting the dots."}</p>
      </div>
      <div className="stat-grid">
        <div className="stat-card peach"><Droplets /><span>Average glucose</span><strong>{avgGlucose ?? "—"} <small>{unit}</small></strong></div>
        <div className="stat-card blue"><HeartPulse /><span>Average pressure</span><strong>{avgSys ? `${avgSys}/${avgDia}` : "—"} <small>mmHg</small></strong></div>
      </div>
      <TrendChart values={glucoseValues} />
      <div className="disclaimer">This diary helps you notice and share patterns. It does not diagnose conditions or replace advice from your healthcare team.</div>
    </section>
  );
}

function TrendChart({ values }) {
  const chartValues = values.length ? values : [90, 110, 105, 130, 118, 125, 112];
  const min = Math.min(...chartValues) - 10;
  const max = Math.max(...chartValues) + 10;
  const points = chartValues.map((value, index) => {
    const x = chartValues.length === 1 ? 150 : 10 + (index * 280) / (chartValues.length - 1);
    const y = 125 - ((value - min) / (max - min || 1)) * 100;
    return `${x},${y}`;
  }).join(" ");
  return (
    <div className="chart-card">
      <div><span>BLOOD SUGAR</span><strong>Recent readings</strong></div>
      <svg viewBox="0 0 300 145" role="img" aria-label="Recent blood sugar trend">
        <line x1="10" y1="25" x2="290" y2="25" />
        <line x1="10" y1="75" x2="290" y2="75" />
        <line x1="10" y1="125" x2="290" y2="125" />
        <polyline points={points} />
        {points.split(" ").map((point, i) => {
          const [cx, cy] = point.split(",");
          return <circle key={i} cx={cx} cy={cy} r="4" />;
        })}
      </svg>
      {!values.length && <small className="sample-note">A preview — your own readings will replace this.</small>}
    </div>
  );
}

function Composer({ type, setType, onClose, onSave, unit }) {
  if (type === "menu") {
    return (
      <div className="modal-layer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="sheet mini-sheet">
          <div className="sheet-handle" />
          <button className="close" onClick={onClose}><X /></button>
          <p className="eyebrow">ADD TO TODAY</p>
          <h2>What would you like to keep?</h2>
          <div className="add-options">
            <button className="glucose" onClick={() => setType("glucose")}><Droplets /><span><strong>Blood sugar</strong><small>Log a glucose reading</small></span><ChevronRight /></button>
            <button className="pressure" onClick={() => setType("pressure")}><HeartPulse /><span><strong>Blood pressure</strong><small>Systolic, diastolic & pulse</small></span><ChevronRight /></button>
            <button className="note" onClick={() => setType("note")}><BookHeart /><span><strong>Life note</strong><small>Keep a memory or thought</small></span><ChevronRight /></button>
          </div>
        </div>
      </div>
    );
  }

  return <EntryForm type={type} onClose={onClose} onSave={onSave} unit={unit} />;
}

function EntryForm({ type, onClose, onSave, unit }) {
  const [form, setForm] = useState({
    value: "",
    timing: "Before meal",
    systolic: "",
    diastolic: "",
    pulse: "",
    title: "",
    note: "",
    mood: "☀️",
    sticker: "",
    photo: "",
    photoName: "",
  });
  const [photoError, setPhotoError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const canSave = type === "glucose" ? form.value : type === "pressure" ? form.systolic && form.diastolic : form.note.trim() || form.photo;

  const attachPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError("That photo is a little too large. Choose one under 15 MB.");
      return;
    }
    setPhotoBusy(true);
    try {
      const photo = await resizePhoto(file);
      setForm((current) => ({ ...current, photo, photoName: file.name }));
    } catch {
      setPhotoError("I couldn’t prepare that photo. Try another image.");
    } finally {
      setPhotoBusy(false);
      event.target.value = "";
    }
  };

  return (
    <div className="modal-layer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="sheet" onSubmit={(e) => { e.preventDefault(); if (canSave) onSave({ ...form, type, unit: type === "glucose" ? unit : undefined }); }}>
        <div className="sheet-handle" />
        <button type="button" className="close" onClick={onClose}><X /></button>
        <div className={`form-badge ${type}`}>{type === "glucose" ? <Droplets /> : type === "pressure" ? <HeartPulse /> : <BookHeart />}</div>
        <p className="eyebrow">{type === "note" ? "A PIECE OF TODAY" : "HEALTH CHECK-IN"}</p>
        <h2>{type === "glucose" ? "Blood sugar" : type === "pressure" ? "Blood pressure" : "Write it down"}</h2>

        {type === "glucose" && (
          <>
            <label className="big-input"><span>Reading</span><div><input autoFocus inputMode="decimal" type="number" step={unit === "mmol/L" ? "0.1" : "1"} value={form.value} onChange={(e) => update("value", e.target.value)} placeholder={unit === "mmol/L" ? "6.1" : "110"} /><small>{unit}</small></div></label>
            <label><span>When?</span><select value={form.timing} onChange={(e) => update("timing", e.target.value)}><option>Before meal</option><option>After meal</option><option>Fasting</option><option>Bedtime</option><option>Other</option></select></label>
          </>
        )}
        {type === "pressure" && (
          <div className="pressure-inputs">
            <label><span>Systolic</span><input autoFocus inputMode="numeric" type="number" value={form.systolic} onChange={(e) => update("systolic", e.target.value)} placeholder="120" /></label>
            <span className="slash">/</span>
            <label><span>Diastolic</span><input inputMode="numeric" type="number" value={form.diastolic} onChange={(e) => update("diastolic", e.target.value)} placeholder="80" /></label>
            <label><span>Pulse</span><input inputMode="numeric" type="number" value={form.pulse} onChange={(e) => update("pulse", e.target.value)} placeholder="72" /></label>
          </div>
        )}
        {type === "note" && (
          <>
            <div className="moods">{["☀️", "🌿", "😌", "🌧️", "💪"].map((mood) => <button type="button" className={form.mood === mood ? "active" : ""} onClick={() => update("mood", mood)} key={mood}>{mood}</button>)}</div>
            <label><span>Title <small>(optional)</small></span><input autoFocus value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="A quiet Tuesday" /></label>
            <div className="photo-attachment">
              <div className="photo-heading">
                <span><ImagePlus /> ADD A PHOTO <small>(optional)</small></span>
                <small>Resized and kept on this device</small>
              </div>
              {form.photo ? (
                <div className="photo-preview">
                  <img src={form.photo} alt="Life note attachment preview" />
                  <div>
                    <strong>{form.photoName || "Your photo"}</strong>
                    <label className="replace-photo"><ImagePlus /> Replace<input type="file" accept="image/*" onChange={attachPhoto} /></label>
                    <button type="button" onClick={() => setForm((current) => ({ ...current, photo: "", photoName: "" }))}><Trash2 /> Remove</button>
                  </div>
                </div>
              ) : (
                <label className={`photo-dropzone ${photoBusy ? "busy" : ""}`}>
                  <ImagePlus />
                  <strong>{photoBusy ? "Preparing your photo…" : "Choose a photo"}</strong>
                  <small>JPG, PNG, or another supported image up to 15 MB</small>
                  <input type="file" accept="image/*" onChange={attachPhoto} disabled={photoBusy} />
                </label>
              )}
              {photoError && <p className="photo-error" role="alert">{photoError}</p>}
            </div>
          </>
        )}
        <StickerPicker type={type} selected={form.sticker} onSelect={(sticker) => update("sticker", sticker)} />
        <label><span>{type === "note" ? "What happened today?" : "Add a note (optional)"}</span><textarea rows={type === "note" ? 5 : 3} value={form.note} onChange={(e) => update("note", e.target.value)} placeholder={type === "note" ? "The ordinary details belong here, too…" : "Meal, medication, how you felt…"} /></label>
        <button className="save-button" disabled={!canSave || photoBusy}>Tuck it into today</button>
      </form>
    </div>
  );
}

function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxSide = 1000;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#f7f2e8";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.76));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function StickerPicker({ type, selected, onSelect }) {
  const stickers = STICKER_PACKS[type];
  return (
    <fieldset className="sticker-picker">
      <legend><Sparkles /> Pick a tiny sticker <small>(optional)</small></legend>
      <div className="sticker-strip">
        {stickers.map((sticker) => (
          <button
            type="button"
            key={sticker.id}
            className={selected === sticker.id ? "selected" : ""}
            onClick={() => onSelect(selected === sticker.id ? "" : sticker.id)}
            aria-label={`${selected === sticker.id ? "Remove" : "Choose"} ${sticker.label} sticker`}
            aria-pressed={selected === sticker.id}
          >
            <Sticker sticker={sticker} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Sticker({ sticker, compact = false }) {
  return (
    <span className={`sticker ${sticker.color} ${compact ? "compact" : ""}`} aria-hidden="true">
      <span className="sticker-art">{sticker.art}</span>
      <span className="sticker-face">{sticker.face}</span>
    </span>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return <button className={active ? "active" : ""} onClick={onClick}>{icon}<span>{label}</span></button>;
}

createRoot(document.getElementById("root")).render(<App />);
