import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { patients, visits, getPatient, todayISO } from "../../data/mockData";
import { EncounterIcon, AlertIcon, ClockIcon, PinIcon } from "../../components/Icons";
import "./Encounter.css";

const CLASSIFICATIONS = [
  { value: "Routine", tone: "success" },
  { value: "Urgent", tone: "warning" },
  { value: "Emergency", tone: "danger" },
];

const emptyForm = {
  complaint: "",
  history: "",
  classification: "Routine",
  examination: "",
  diagnosis: "",
  treatment: "",
  followUpDate: "",
};

const toneOf = (c) => CLASSIFICATIONS.find((x) => x.value === c)?.tone || "muted";
const hasAllergy = (a) => a && String(a).toLowerCase() !== "none";
const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Encounter() {
  const [searchParams] = useSearchParams();
  const [patientId, setPatientId] = useState(searchParams.get("patient") || "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sessionVisits, setSessionVisits] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const today = todayISO();
  const selectedPatient = patients.find((p) => String(p.id) === String(patientId));

  const matches = patients.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || "").toLowerCase().includes(q) ||
      String(p.room || "").toLowerCase().includes(q) ||
      (p.nationality || "").toLowerCase().includes(q)
    );
  });

  const todaysVisits = [
    ...sessionVisits,
    ...visits.filter((v) => v.date === today),
  ];

  const choosePatient = (p) => {
    setPatientId(String(p.id));
    setQuery("");
    setOpen(false);
    setMessage({ text: "", type: "" });
  };

  const clearPatient = () => {
    setPatientId("");
    setQuery("");
    setOpen(true);
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // ما يعملش submit للفورم
      if (matches.length > 0) choosePatient(matches[0]);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setMessage({ text: "Please select a patient first.", type: "error" });
      return;
    }
    setSessionVisits([
      {
        ...form,
        id: `new-${Date.now()}`,
        patientId: selectedPatient.id,
        date: today,
        time: new Date().toTimeString().slice(0, 5),
        status: "In progress",
        isNew: true,
      },
      ...sessionVisits,
    ]);
    setForm(emptyForm);
    setMessage({ text: "Encounter saved successfully.", type: "success" });
  };

  return (
    <div className="enc-page">
      <section className="enc-head">
        <h2>Clinical Encounter</h2>
        <p>Record complaint, history, examination, diagnosis and treatment.</p>
      </section>

      <section className="enc-layout">
        {/* ---------- Form ---------- */}
        <form className="card enc-panel enc-form" onSubmit={handleSubmit}>
          <header className="enc-panel-head">
            <h3><EncounterIcon size={18} /> New encounter</h3>
          </header>

          {/* ---------- Patient search picker ---------- */}
          <div className="enc-field">
            <span className="enc-label">Patient</span>

            {selectedPatient ? (
              <div className="enc-selected">
                <span className="enc-avatar">{initials(selectedPatient.name)}</span>
                <div className="enc-selected-main">
                  <strong>{selectedPatient.name}</strong>
                  <span>Room {selectedPatient.room} · {selectedPatient.nationality}</span>
                </div>
                <button type="button" className="btn btn-outline" onClick={clearPatient}>
                  Change
                </button>
              </div>
            ) : (
              <div className="enc-picker">
                <input
                  type="text"
                  placeholder="Search by name, room or nationality..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setOpen(false)}
                  onKeyDown={handleSearchKey}
                  autoComplete="off"
                />
                {open && (
                  <ul className="enc-dropdown">
                    {matches.length === 0 ? (
                      <li className="enc-dropdown-empty">No patients found.</li>
                    ) : (
                      matches.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            className="enc-option"
                            onMouseDown={(e) => { e.preventDefault(); choosePatient(p); }}
                          >
                            <span className="enc-avatar sm">{initials(p.name)}</span>
                            <span className="enc-option-main">
                              <strong>{p.name}</strong>
                              <span>Room {p.room} · {p.nationality}</span>
                            </span>
                            {hasAllergy(p.allergies) && <span className="enc-option-dot" title="Has allergies" />}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {selectedPatient && hasAllergy(selectedPatient.allergies) && (
            <div className="enc-alert">
              <AlertIcon size={18} />
              <div>
                <strong>Allergies</strong>
                <span>{selectedPatient.allergies}</span>
              </div>
            </div>
          )}

          <label>
            Complaint
            <textarea name="complaint" value={form.complaint} onChange={handleChange} required />
          </label>

          <label>
            History (onset, duration, associated symptoms)
            <textarea name="history" value={form.history} onChange={handleChange} />
          </label>

          <div className="enc-field">
            <span className="enc-label">Classification</span>
            <div className="enc-seg">
              {CLASSIFICATIONS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  className={`enc-seg-btn tone-${c.tone} ${form.classification === c.value ? "active" : ""}`}
                  onClick={() => setForm({ ...form, classification: c.value })}
                >
                  <span className="enc-seg-dot" />
                  {c.value}
                </button>
              ))}
            </div>
          </div>

          <label>
            Examination
            <textarea name="examination" value={form.examination} onChange={handleChange} />
          </label>

          <label>
            Diagnosis
            <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} required />
          </label>

          <label>
            Treatment
            <textarea name="treatment" value={form.treatment} onChange={handleChange} />
          </label>

          <label>
            Follow-up date
            <input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange} />
          </label>

          <button type="submit" className="btn btn-primary">Save encounter</button>
          {message.text && <p className={`enc-message ${message.type}`}>{message.text}</p>}
        </form>

        {/* ---------- Today's encounters ---------- */}
        <article className="card enc-panel">
          <header className="enc-panel-head">
            <h3><ClockIcon size={18} /> Today's encounters</h3>
            <span className="badge badge-muted">{todaysVisits.length}</span>
          </header>

          {todaysVisits.length === 0 ? (
            <p className="enc-empty">No encounters today.</p>
          ) : (
            <ul className="enc-list">
              {todaysVisits.map((v) => {
                const p = getPatient(v.patientId);
                const tone = toneOf(v.classification);
                return (
                  <li key={v.id} className="enc-row">
                    <span className={`enc-dot enc-dot-${tone}`} />
                    <div className="enc-row-main">
                      <strong>{p?.name || "Unknown patient"}</strong>
                      <span className="enc-meta">
                        <PinIcon size={13} /> Room {p?.room} · {v.time}
                      </span>
                      <span className="enc-complaint">{v.complaint}</span>
                      {v.isNew && (
                        <div className="enc-details">
                          {v.history && <p><b>History:</b> {v.history}</p>}
                          {v.examination && <p><b>Examination:</b> {v.examination}</p>}
                          <p><b>Diagnosis:</b> {v.diagnosis}</p>
                          {v.treatment && <p><b>Treatment:</b> {v.treatment}</p>}
                          {v.followUpDate && <p><b>Follow-up:</b> {v.followUpDate}</p>}
                        </div>
                      )}
                    </div>
                    <span className={`badge badge-${tone}`}>{v.classification}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}

export default Encounter;