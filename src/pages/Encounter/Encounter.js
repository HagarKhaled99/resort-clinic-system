import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { patients, visits, getPatient, todayISO, caseClassifications } from "../../data/mockData";
import {
  examinationOptions,
  diagnosesByClassification,
  investigationOptions,
  dispositionOptions,
  OTHER,
} from "../../data/encounterOptions";
import { EncounterIcon, AlertIcon, ClockIcon, PinIcon } from "../../components/Icons";
import "./Encounter.css";

const SYMPTOMS = [
  "Headache", "Fever", "Dizziness", "Nausea", "Vomiting", "Diarrhea",
  "Abdominal pain", "Cough", "Sore throat", "Skin rash", "Injury", "Dehydration",
];
const PAIN_SYMPTOMS = ["Headache", "Abdominal pain", "Sore throat", "Injury"];
const ONSET_OPTIONS = ["Sudden", "Gradual", "Unknown"];
const DURATION_OPTIONS = ["Today", "1–3 days", "4–7 days", "More than a week", "Custom"];
const EXAM_FINDINGS = [
  "Abdominal tenderness", "Skin redness", "Swelling", "Wheezing",
  "Reduced mobility", "No abnormal findings",
];
const NO_FINDINGS = "No abnormal findings";
const NON_MED_TREATMENTS = [
  "Wound cleaning", "Wound dressing", "Bandaging", "Nebulization", "IV fluids",
  "Cold compress", "Splint application", "Rest", "Stay hydrated",
  "Avoid sun exposure", "Avoid swimming", "Avoid strenuous activity",
  "Dietary instructions", "Monitor symptoms", "Return if symptoms worsen",
];
const EXAM_SYSTEMS = [
  { key: "chest", label: "Chest" },
  { key: "heart", label: "Heart" },
  { key: "abdomen", label: "Abdomen" },
  { key: "neurology", label: "Neurology" },
];

const emptyForm = {
  symptoms: [],
  complaintExtra: "",
  onset: "",
  duration: "",
  durationCustom: "",
  painSeverity: "",
  historyExtra: "",
  classification: caseClassifications[0],
  systolic: "",
  diastolic: "",
  pulse: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  weight: "",
  chest: "",
  chestOther: "",
  heart: "",
  heartOther: "",
  abdomen: "",
  abdomenOther: "",
  neurology: "",
  neurologyOther: "",
  local: "",
  findings: [],
  diagnosis: "",
  diagnosisOther: "",
  diagnosisStatus: "Provisional",
  investigation: "",
  disposition: "",
  treatment: "",
  procedures: [],
  instructionsExtra: "",
  needsFollowUp: "no",
  followUpDate: "",
  followUpTime: "",
  followUpReason: "",
};

const hasAllergy = (a) => a && String(a).toLowerCase() !== "none";
const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const hasVitals = (v) =>
  v.systolic || v.diastolic || v.pulse || v.temperature ||
  v.respiratoryRate || v.oxygenSaturation || v.weight;

const buildComplaint = (f) =>
  [f.symptoms.join(", "), f.complaintExtra.trim()].filter(Boolean).join(" — ");

const buildHistory = (f) => {
  const duration = f.duration === "Custom" ? f.durationCustom.trim() : f.duration;
  const showPain = f.symptoms.some((s) => PAIN_SYMPTOMS.includes(s));
  return [
    f.onset && `Onset: ${f.onset}`,
    duration && `Duration: ${duration}`,
    showPain && f.painSeverity !== "" && `Pain: ${f.painSeverity}/10`,
    f.historyExtra.trim(),
  ].filter(Boolean).join(" · ");
};

const buildExamination = (f) => {
  const parts = EXAM_SYSTEMS.map(({ key, label }) => {
    const value = f[key] === OTHER ? f[`${key}Other`].trim() : f[key];
    return value ? `${label}: ${value}` : "";
  }).filter(Boolean);
  if (f.findings.length > 0) parts.push(`Findings: ${f.findings.join(", ")}`);
  if (f.local.trim()) parts.push(`Local: ${f.local.trim()}`);
  return parts.join("; ");
};

function Encounter() {
  const [searchParams] = useSearchParams();
  const [patientId, setPatientId] = useState(searchParams.get("patient") || "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [symptomQuery, setSymptomQuery] = useState("");
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

  const visibleSymptoms = SYMPTOMS.filter((s) =>
    s.toLowerCase().includes(symptomQuery.trim().toLowerCase())
  );
  const showPain = form.symptoms.some((s) => PAIN_SYMPTOMS.includes(s));
  const diagnosisOptions = diagnosesByClassification[form.classification] || [OTHER];

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
      e.preventDefault();
      if (matches.length > 0) choosePatient(matches[0]);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleItem = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((x) => x !== value)
        : [...f[field], value],
    }));

  // "No abnormal findings" excludes the other findings, and vice versa
  const toggleFinding = (value) =>
    setForm((f) => {
      if (f.findings.includes(value)) {
        return { ...f, findings: f.findings.filter((x) => x !== value) };
      }
      if (value === NO_FINDINGS) return { ...f, findings: [NO_FINDINGS] };
      return { ...f, findings: [...f.findings.filter((x) => x !== NO_FINDINGS), value] };
    });

  // Diagnoses depend on the classification, so reset the diagnosis when it changes
  const handleClassification = (e) =>
    setForm({ ...form, classification: e.target.value, diagnosis: "", diagnosisOther: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setMessage({ text: "Please select a patient first.", type: "error" });
      return;
    }
    const complaint = buildComplaint(form);
    if (!complaint) {
      setMessage({ text: "Select at least one symptom or describe the complaint.", type: "error" });
      return;
    }
    const finalDiagnosis =
      form.diagnosis === OTHER ? form.diagnosisOther.trim() : form.diagnosis;
    const followUp = form.needsFollowUp === "yes";

    setSessionVisits([
      {
        ...form,
        complaint,
        history: buildHistory(form),
        examination: buildExamination(form),
        diagnosis: finalDiagnosis,
        instructions: [...form.procedures, form.instructionsExtra.trim()]
          .filter(Boolean)
          .join(", "),
        followUpDate: followUp ? form.followUpDate : "",
        followUpTime: followUp ? form.followUpTime : "",
        followUpReason: followUp ? form.followUpReason.trim() : "",
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
    setSymptomQuery("");
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

          {/* ---------- Patient bar (stays visible while scrolling) ---------- */}
          <div className="enc-patient-bar">
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
          </div>

          {/* ---------- 1. Chief complaint ---------- */}
          <fieldset className="enc-section">
            <legend>Chief complaint</legend>
            <input
              type="search"
              placeholder="Search symptoms..."
              aria-label="Search symptoms"
              value={symptomQuery}
              onChange={(e) => setSymptomQuery(e.target.value)}
            />
            <div className="enc-chips">
              {visibleSymptoms.length === 0 && (
                <span className="enc-hint">No matching symptom. Use the box below.</span>
              )}
              {visibleSymptoms.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`enc-chip${form.symptoms.includes(s) ? " active" : ""}`}
                  aria-pressed={form.symptoms.includes(s)}
                  onClick={() => toggleItem("symptoms", s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <label>
              Additional complaints (optional)
              <input name="complaintExtra" value={form.complaintExtra} onChange={handleChange} />
            </label>
          </fieldset>

          {/* ---------- 2. History ---------- */}
          <fieldset className="enc-section">
            <legend>History of present illness</legend>
            <div className="enc-grid enc-grid-2">
              <label>
                Onset
                <select name="onset" value={form.onset} onChange={handleChange}>
                  <option value="">Select…</option>
                  {ONSET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label>
                Duration
                <select name="duration" value={form.duration} onChange={handleChange}>
                  <option value="">Select…</option>
                  {DURATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              {form.duration === "Custom" && (
                <label className="enc-span-all">
                  Custom duration
                  <input name="durationCustom" placeholder="e.g. 10 days"
                         value={form.durationCustom} onChange={handleChange} />
                </label>
              )}
            </div>

            {showPain && (
              <label>
                Pain severity:{" "}
                {form.painSeverity === "" ? "not set" : `${form.painSeverity}/10`}
                <input type="range" name="painSeverity" min="0" max="10" step="1"
                       value={form.painSeverity === "" ? 0 : form.painSeverity}
                       onChange={handleChange} />
                {form.painSeverity !== "" && (
                  <button type="button" className="enc-link"
                          onClick={() => setForm({ ...form, painSeverity: "" })}>
                    Clear
                  </button>
                )}
              </label>
            )}

            <label>
              Additional history (optional)
              <textarea name="historyExtra" value={form.historyExtra} onChange={handleChange} />
            </label>
          </fieldset>

          {/* ---------- Vital signs ---------- */}
          <fieldset className="enc-section">
            <legend>Vital signs (optional)</legend>
            <div className="enc-grid">
              <label>
                BP systolic (mmHg)
                <input type="number" name="systolic" min="50" max="260"
                       value={form.systolic} onChange={handleChange} />
              </label>
              <label>
                BP diastolic (mmHg)
                <input type="number" name="diastolic" min="30" max="160"
                       value={form.diastolic} onChange={handleChange} />
              </label>
              <label>
                Pulse (bpm)
                <input type="number" name="pulse" min="20" max="250"
                       value={form.pulse} onChange={handleChange} />
              </label>
              <label>
                Temperature (°C)
                <input type="number" name="temperature" min="30" max="44" step="0.1"
                       value={form.temperature} onChange={handleChange} />
                {form.temperature !== "" && Number(form.temperature) >= 38 && (
                  <small className="enc-warn">Fever</small>
                )}
              </label>
              <label>
                Respiratory rate (/min)
                <input type="number" name="respiratoryRate" min="5" max="60"
                       value={form.respiratoryRate} onChange={handleChange} />
              </label>
              <label>
                SpO₂ (%)
                <input type="number" name="oxygenSaturation" min="50" max="100"
                       value={form.oxygenSaturation} onChange={handleChange} />
                {form.oxygenSaturation !== "" && Number(form.oxygenSaturation) < 94 && (
                  <small className="enc-warn">Low oxygen saturation</small>
                )}
              </label>
              <label>
                Weight (kg)
                <input type="number" name="weight" min="1" max="300" step="0.1"
                       value={form.weight} onChange={handleChange} />
              </label>
            </div>
          </fieldset>

          {/* ---------- 3. Examination ---------- */}
          <fieldset className="enc-section">
            <legend>Examination</legend>
            <div className="enc-grid enc-grid-2">
              {EXAM_SYSTEMS.map(({ key, label }) => (
                <div key={key} className="enc-exam-item">
                  <label>
                    {label}
                    <select name={key} value={form[key]} onChange={handleChange}>
                      <option value="">Select…</option>
                      {examinationOptions[key].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                  {form[key] === OTHER && (
                    <input
                      name={`${key}Other`}
                      placeholder="Describe"
                      aria-label={`${label} - other`}
                      value={form[`${key}Other`]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>

            <span className="enc-label">Findings</span>
            <div className="enc-chips">
              {EXAM_FINDINGS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`enc-chip${form.findings.includes(f) ? " active" : ""}`}
                  aria-pressed={form.findings.includes(f)}
                  onClick={() => toggleFinding(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <label>
              Local / additional findings (optional)
              <input name="local" placeholder="Local examination findings"
                     value={form.local} onChange={handleChange} />
            </label>
          </fieldset>

          {/* ---------- 4. Classification & diagnosis ---------- */}
          <fieldset className="enc-section">
            <legend>Classification & diagnosis</legend>

            <label>
              Classification
              <select name="classification" value={form.classification} onChange={handleClassification}>
                {caseClassifications.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <div className="enc-grid enc-grid-2">
              <label>
                Diagnosis
                <select name="diagnosis" value={form.diagnosis} onChange={handleChange} required>
                  <option value="">Select…</option>
                  {diagnosisOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                Diagnosis status
                <select name="diagnosisStatus" value={form.diagnosisStatus} onChange={handleChange}>
                  <option value="Provisional">Provisional</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </label>
            </div>
            {form.diagnosis === OTHER && (
              <input
                name="diagnosisOther"
                placeholder="Describe the diagnosis"
                aria-label="Diagnosis - other"
                value={form.diagnosisOther}
                onChange={handleChange}
                required
              />
            )}
          </fieldset>

          {/* ---------- 5. Treatment ---------- */}
          <fieldset className="enc-section">
            <legend>Treatment & instructions</legend>

            <div className="enc-grid enc-grid-2">
              <label>
                Investigations
                <select name="investigation" value={form.investigation} onChange={handleChange}>
                  <option value="">Select…</option>
                  {investigationOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label>
                Management
                <select name="disposition" value={form.disposition} onChange={handleChange}>
                  <option value="">Select…</option>
                  {dispositionOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Treatment / medication
              <textarea name="treatment" value={form.treatment} onChange={handleChange} />
            </label>

            <span className="enc-label">Non-medication treatment & patient instructions</span>
            <div className="enc-chips">
              {NON_MED_TREATMENTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`enc-chip${form.procedures.includes(t) ? " active" : ""}`}
                  aria-pressed={form.procedures.includes(t)}
                  onClick={() => toggleItem("procedures", t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <label>
              Additional instructions (optional)
              <textarea name="instructionsExtra" value={form.instructionsExtra} onChange={handleChange} />
            </label>
          </fieldset>

          {/* ---------- 6. Follow-up ---------- */}
          <fieldset className="enc-section">
            <legend>Follow-up</legend>
            <span className="enc-label">Does the patient require a follow-up?</span>
            <div className="enc-radios">
              <label className="enc-radio">
                <input type="radio" name="needsFollowUp" value="yes"
                       checked={form.needsFollowUp === "yes"} onChange={handleChange} />
                Yes
              </label>
              <label className="enc-radio">
                <input type="radio" name="needsFollowUp" value="no"
                       checked={form.needsFollowUp === "no"} onChange={handleChange} />
                No
              </label>
            </div>

            {form.needsFollowUp === "yes" && (
              <>
                <div className="enc-grid enc-grid-2">
                  <label>
                    Follow-up date
                    <input type="date" name="followUpDate" value={form.followUpDate}
                           onChange={handleChange} required />
                  </label>
                  <label>
                    Follow-up time
                    <input type="time" name="followUpTime" value={form.followUpTime}
                           onChange={handleChange} />
                  </label>
                </div>
                <label>
                  Reason for follow-up
                  <input name="followUpReason" value={form.followUpReason} onChange={handleChange} />
                </label>
              </>
            )}
          </fieldset>

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
                return (
                  <li key={v.id} className="enc-row">
                    <div className="enc-row-main">
                      <strong>{p?.name || "Unknown patient"}</strong>
                      <span className="enc-meta">
                        <PinIcon size={13} /> Room {p?.room} · {v.time}
                      </span>
                      <span className="enc-complaint">{v.complaint}</span>
                      {v.isNew && (
                        <div className="enc-details">
                          {v.history && <p><b>History:</b> {v.history}</p>}
                          {hasVitals(v) && (
                            <p>
                              <b>Vitals:</b>{" "}
                              {(v.systolic || v.diastolic) && <>BP {v.systolic || "?"}/{v.diastolic || "?"}</>}
                              {v.pulse && <> · Pulse {v.pulse}</>}
                              {v.temperature && <> · Temp {v.temperature}°C</>}
                              {v.respiratoryRate && <> · RR {v.respiratoryRate}</>}
                              {v.oxygenSaturation && <> · SpO₂ {v.oxygenSaturation}%</>}
                              {v.weight && <> · Weight {v.weight} kg</>}
                            </p>
                          )}
                          {v.examination && <p><b>Examination:</b> {v.examination}</p>}
                          <p>
                            <b>Diagnosis:</b> {v.diagnosis}
                            {v.diagnosisStatus && <> ({v.diagnosisStatus})</>}
                          </p>
                          {v.investigation && <p><b>Investigations:</b> {v.investigation}</p>}
                          {v.disposition && <p><b>Management:</b> {v.disposition}</p>}
                          {v.treatment && <p><b>Treatment:</b> {v.treatment}</p>}
                          {v.instructions && <p><b>Instructions:</b> {v.instructions}</p>}
                          {v.followUpDate && (
                            <p>
                              <b>Follow-up:</b> {v.followUpDate}
                              {v.followUpTime && <> at {v.followUpTime}</>}
                              {v.followUpReason && <> — {v.followUpReason}</>}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="badge badge-muted">{v.classification}</span>
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