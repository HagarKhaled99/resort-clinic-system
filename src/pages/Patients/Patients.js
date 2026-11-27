import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patients as initialPatients, visits } from "../../data/mockData";
import {
  PlusIcon, EncounterIcon, PinIcon, AlertIcon, PatientsIcon, CalendarIcon,
} from "../../components/Icons";
import {
  NATIONALITIES, DIAL_CODES, AGES, SUGGESTIONS, findCountry, splitPhone, joinPhone,
} from "./formOptions";
import "./Patients.css";

// Same wording as the printed intake form (questions 1-13)
const INTAKE_COMPLAINTS = [
  "Fever or chills",
  "Cough or sore throat",
  "Difficulty breathing",
  "Chest pain or palpitations",
  "Abdominal pain",
  "Nausea or vomiting",
  "Diarrhoea",
  "Headache or dizziness",
  "Sunburn / unwell after heat or sun",
  "Skin rash, itching or sting",
  "Injury, fall or wound",
  "Ear or eye problem",
  "Another problem",
];

// Questions 21-26
const HISTORY_FLAGS = [
  ["hypertension", "High blood pressure"],
  ["diabetes", "Diabetes"],
  ["heartDisease", "Heart disease"],
  ["asthma", "Asthma or lung disease"],
  ["epilepsy", "Epilepsy or seizures"],
  ["kidneyLiver", "Kidney or liver disease"],
];

const emptyPatient = {
  // identity & stay
  name: "", dob: "", age: "", gender: "Female", nationality: "", passport: "",
  phone: "", phoneCode: "+20", phoneNumber: "", emergencyContact: "",
  hotel: "", room: "", address: "",
  arrivalDate: "", departureDate: "", travelCompany: "",
  guidePhone: "", guideCode: "+20", guideNumber: "",
  // today's complaint (questions 1-13)
  intakeComplaints: [], intakeComplaintOther: "",
  // allergies (14-18)
  allergyMedicine: false, allergyMedicineDetails: "",
  allergyPenicillin: false, allergyPainkillers: false,
  allergyFood: false, allergyFoodDetails: "", severeReaction: false,
  // medicines (19-20)
  takingMedicines: false, medications: "", bloodThinners: false,
  // history (21-28)
  hypertension: false, diabetes: false, heartDisease: false, asthma: false,
  epilepsy: false, kidneyLiver: false,
  otherIllness: false, otherIllnessDetails: "", surgery: false, surgeryDetails: "",
  // women only (29-30) and insurance (31)
  pregnant: false, breastfeeding: false,
  insurance: false, insuranceDetails: "",
  // summary text kept for the other pages (built on save)
  allergies: "", medicalHistory: "",
};

const visitBadge = { Completed: "success", "In progress": "info", Waiting: "warning" };

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const hasAllergy = (a) => a && String(a).toLowerCase() !== "none";
const yesNo = (v) => (v === undefined ? "-" : v ? "Yes" : "No");

const ageFromDob = (dob) => {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
};

// One readable line, because Encounter and the other pages read these as plain text
const buildAllergies = (f) => {
  const parts = [];
  if (f.allergyMedicine) parts.push(f.allergyMedicineDetails.trim() || "Medicine allergy");
  if (f.allergyPenicillin) parts.push("Penicillin / antibiotics");
  if (f.allergyPainkillers) parts.push("Aspirin / painkillers");
  if (f.allergyFood) parts.push(`Food: ${f.allergyFoodDetails.trim() || "unspecified"}`);
  if (f.severeReaction) parts.push("History of severe allergic reaction");
  return parts.length ? parts.join(", ") : "None";
};

const buildHistory = (f) => {
  const parts = HISTORY_FLAGS.filter(([key]) => f[key]).map(([, label]) => label);
  if (f.otherIllness) parts.push(f.otherIllnessDetails.trim() || "Other long-term illness");
  if (f.surgery) parts.push(`Surgery: ${f.surgeryDetails.trim() || "unspecified"}`);
  return parts.join(", ");
};

const buildPatient = (f, id) => ({
  ...f,
  id,
  age: f.dob ? ageFromDob(f.dob) : Number(f.age),
  phone: joinPhone(f.phoneCode, f.phoneNumber),
  guidePhone: joinPhone(f.guideCode, f.guideNumber),
  allergies: buildAllergies(f),
  medicalHistory: buildHistory(f),
  medications: f.takingMedicines ? f.medications : "",
  pregnant: f.gender === "Female" ? f.pregnant : false,
  breastfeeding: f.gender === "Female" ? f.breastfeeding : false,
});

// Old patients only have free-text allergies / medicalHistory / medications.
// Move that text into the new fields so nothing is lost when they are edited.
const toForm = (p) => {
  const form = { ...emptyPatient, ...p };
  if (p.allergyMedicine === undefined && hasAllergy(p.allergies)) {
    form.allergyMedicine = true;
    form.allergyMedicineDetails = p.allergies;
  }
  if (p.phoneNumber === undefined && p.phone) {
    const { code, number } = splitPhone(p.phone);
    form.phoneCode = code;
    form.phoneNumber = number;
  }
  if (p.guideNumber === undefined && p.guidePhone) {
    const { code, number } = splitPhone(p.guidePhone);
    form.guideCode = code;
    form.guideNumber = number;
  }
  if (p.takingMedicines === undefined && p.medications) form.takingMedicines = true;
  if (p.otherIllness === undefined && p.medicalHistory) {
    form.otherIllness = true;
    form.otherIllnessDetails = p.medicalHistory;
  }
  return form;
};

function Patients() {
  const [list, setList] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(initialPatients[0]?.id);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPatient);
  const navigate = useNavigate();

  const filtered = list.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      String(p.room || "").includes(q) ||
      (p.nationality || "").toLowerCase().includes(q)
    );
  });

  const selected = list.find((p) => p.id === selectedId);
  const patientVisits = selected
    ? visits
        .filter((v) => v.patientId === selected.id)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    : [];

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const handleChange = (e) => set(e.target.name, e.target.value);

  // Picking a known nationality also suggests its phone country code (if no number typed yet)
  const handleNationality = (e) => {
    const value = e.target.value;
    const country = findCountry(value);
    setForm((f) => ({
      ...f,
      nationality: value,
      phoneCode: country && !f.phoneNumber ? country.dial : f.phoneCode,
    }));
  };

  // Suggestions taken from patients already in the list
  const uniqueValues = (key) => [...new Set(list.map((p) => p[key]).filter(Boolean))];
  const hotels = uniqueValues("hotel");
  const companies = uniqueValues("travelCompany");

  const toggleComplaint = (c) =>
    setForm((f) => ({
      ...f,
      intakeComplaints: f.intakeComplaints.includes(c)
        ? f.intakeComplaints.filter((x) => x !== c)
        : [...f.intakeComplaints, c],
    }));

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyPatient);
  };

  const toggleForm = () => {
    if (showForm) {
      closeForm();
    } else {
      setEditingId(null);
      setForm(emptyPatient);
      setShowForm(true);
    }
  };

  const startEdit = () => {
    setForm(toForm(selected));
    setEditingId(selected.id);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const patient = buildPatient(form, editingId || Date.now());
    setList(editingId ? list.map((p) => (p.id === editingId ? patient : p)) : [patient, ...list]);
    setSelectedId(patient.id);
    closeForm();
  };

  return (
    <div className="pt-page">
      {/* ---------- Header ---------- */}
      <section className="pt-head">
        <div>
          <h2>Patient Records</h2>
          <p>Search patients, add new ones and view their medical record.</p>
        </div>
        <button className="btn btn-primary" onClick={toggleForm}>
          <PlusIcon size={17} /> {showForm ? "Cancel" : "New patient"}
        </button>
      </section>

      {/* ---------- Add / edit patient form (same sections as the printed intake form) ---------- */}
      {showForm && (
        <form className="card pt-panel pt-form" onSubmit={handleSave} autoComplete="off">
          <header className="pt-panel-head">
            <h3>
              <PlusIcon size={18} /> {editingId ? "Edit patient" : "New patient"}
            </h3>
          </header>

          <fieldset className="pt-section">
            <legend>Patient & stay</legend>
            <div className="pt-form-grid">
              <label>Full name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>Date of birth
                <input name="dob" type="date" value={form.dob} onChange={handleChange} />
              </label>
              <label>Age {form.dob ? "(from date of birth)" : ""}
                <select
                  name="age"
                  value={form.dob ? ageFromDob(form.dob) : form.age}
                  onChange={handleChange}
                  disabled={Boolean(form.dob)}
                  required={!form.dob}
                >
                  <option value="">Select…</option>
                  {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>
              <label>Sex
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </label>
              <label>Nationality
                <input name="nationality" list="pt-nationalities" placeholder="Type or choose"
                       value={form.nationality} onChange={handleNationality} required />
              </label>
              <label>Passport / ID
                <input name="passport" value={form.passport} onChange={handleChange} />
              </label>
              <PhoneField label="Telephone" codeName="phoneCode" numberName="phoneNumber"
                          form={form} onChange={set} />
              <label>Emergency contact
                <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
              </label>
              <label>Hotel name
                <input name="hotel" list="pt-hotels" value={form.hotel} onChange={handleChange} />
              </label>
              <label>Room number
                <input name="room" value={form.room} onChange={handleChange} required />
              </label>
              <label>Date of arrival
                <input name="arrivalDate" type="date" value={form.arrivalDate} onChange={handleChange} />
              </label>
              <label>Date of departure
                <input name="departureDate" type="date" min={form.arrivalDate || undefined}
                       value={form.departureDate} onChange={handleChange} />
              </label>
              <label>Travel company
                <input name="travelCompany" list="pt-companies" value={form.travelCompany} onChange={handleChange} />
              </label>
              <PhoneField label="Tour guide telephone" codeName="guideCode" numberName="guideNumber"
                          form={form} onChange={set} />
              <label className="wide">Home address
                <input name="address" value={form.address} onChange={handleChange} />
              </label>
            </div>
          </fieldset>

          <fieldset className="pt-section">
            <legend>Today's complaint (from the form)</legend>
            <div className="pt-checks">
              {INTAKE_COMPLAINTS.map((c) => (
                <label key={c} className="pt-check">
                  <input
                    type="checkbox"
                    checked={form.intakeComplaints.includes(c)}
                    onChange={() => toggleComplaint(c)}
                  />
                  {c}
                </label>
              ))}
            </div>
            {form.intakeComplaints.includes("Another problem") && (
              <input
                className="pt-text"
                name="intakeComplaintOther"
                placeholder="Please specify"
                aria-label="Another problem - specify"
                value={form.intakeComplaintOther}
                onChange={handleChange}
              />
            )}
          </fieldset>

          <fieldset className="pt-section">
            <legend>Allergies</legend>
            <div className="pt-yn-list">
              <YesNo label="Allergic to any medicine?" name="allergyMedicine"
                     value={form.allergyMedicine} onChange={set}>
                {form.allergyMedicine && (
                  <input className="pt-text" list="pt-med-allergies" name="allergyMedicineDetails" placeholder="Please specify"
                         aria-label="Medicine allergy - specify"
                         value={form.allergyMedicineDetails} onChange={handleChange} />
                )}
              </YesNo>
              <YesNo label="Allergic to penicillin or other antibiotics?" name="allergyPenicillin"
                     value={form.allergyPenicillin} onChange={set} />
              <YesNo label="Allergic to aspirin or painkillers (e.g. ibuprofen)?" name="allergyPainkillers"
                     value={form.allergyPainkillers} onChange={set} />
              <YesNo label="Food allergy (e.g. nuts, seafood)?" name="allergyFood"
                     value={form.allergyFood} onChange={set}>
                {form.allergyFood && (
                  <input className="pt-text" list="pt-food-allergies" name="allergyFoodDetails" placeholder="Please specify"
                         aria-label="Food allergy - specify"
                         value={form.allergyFoodDetails} onChange={handleChange} />
                )}
              </YesNo>
              <YesNo label="Ever had a severe allergic reaction (swelling of face or throat, difficulty breathing)?"
                     name="severeReaction" value={form.severeReaction} onChange={set} />
            </div>
          </fieldset>

          <fieldset className="pt-section">
            <legend>Current medicines</legend>
            <div className="pt-yn-list">
              <YesNo label="Taking any medicines at the moment?" name="takingMedicines"
                     value={form.takingMedicines} onChange={set}>
                {form.takingMedicines && (
                  <input className="pt-text" list="pt-medicines" name="medications" placeholder="Please specify"
                         aria-label="Current medicines - specify"
                         value={form.medications} onChange={handleChange} />
                )}
              </YesNo>
              <YesNo label="Take blood thinners (e.g. warfarin, aspirin)?" name="bloodThinners"
                     value={form.bloodThinners} onChange={set} />
            </div>
          </fieldset>

          <fieldset className="pt-section">
            <legend>Medical history</legend>
            <div className="pt-yn-list">
              {HISTORY_FLAGS.map(([key, label]) => (
                <YesNo key={key} label={label} name={key} value={form[key]} onChange={set} />
              ))}
              <YesNo label="Another long-term illness" name="otherIllness"
                     value={form.otherIllness} onChange={set}>
                {form.otherIllness && (
                  <input className="pt-text" list="pt-illnesses" name="otherIllnessDetails" placeholder="Please specify"
                         aria-label="Other illness - specify"
                         value={form.otherIllnessDetails} onChange={handleChange} />
                )}
              </YesNo>
              <YesNo label="An operation (surgery)" name="surgery"
                     value={form.surgery} onChange={set}>
                {form.surgery && (
                  <input className="pt-text" list="pt-surgeries" name="surgeryDetails" placeholder="Please specify"
                         aria-label="Surgery - specify"
                         value={form.surgeryDetails} onChange={handleChange} />
                )}
              </YesNo>
            </div>
          </fieldset>

          {form.gender === "Female" && (
            <fieldset className="pt-section">
              <legend>For women only</legend>
              <div className="pt-yn-list">
                <YesNo label="Pregnant, or could be pregnant?" name="pregnant"
                       value={form.pregnant} onChange={set} />
                <YesNo label="Breastfeeding?" name="breastfeeding"
                       value={form.breastfeeding} onChange={set} />
              </div>
            </fieldset>
          )}

          <fieldset className="pt-section">
            <legend>Insurance</legend>
            <div className="pt-yn-list">
              <YesNo label="Travel or medical insurance?" name="insurance"
                     value={form.insurance} onChange={set}>
                {form.insurance && (
                  <input className="pt-text" name="insuranceDetails" placeholder="Please specify"
                         aria-label="Insurance - specify"
                         value={form.insuranceDetails} onChange={handleChange} />
                )}
              </YesNo>
            </div>
          </fieldset>

          <datalist id="pt-nationalities">
            {NATIONALITIES.map((n) => <option key={n} value={n} />)}
          </datalist>
          <datalist id="pt-hotels">
            {hotels.map((h) => <option key={h} value={h} />)}
          </datalist>
          <datalist id="pt-companies">
            {companies.map((c) => <option key={c} value={c} />)}
          </datalist>
          <datalist id="pt-med-allergies">
            {SUGGESTIONS.medicineAllergies.map((o) => <option key={o} value={o} />)}
          </datalist>
          <datalist id="pt-food-allergies">
            {SUGGESTIONS.foodAllergies.map((o) => <option key={o} value={o} />)}
          </datalist>
          <datalist id="pt-medicines">
            {SUGGESTIONS.medicines.map((o) => <option key={o} value={o} />)}
          </datalist>
          <datalist id="pt-illnesses">
            {SUGGESTIONS.illnesses.map((o) => <option key={o} value={o} />)}
          </datalist>
          <datalist id="pt-surgeries">
            {SUGGESTIONS.surgeries.map((o) => <option key={o} value={o} />)}
          </datalist>

          <div className="pt-form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save changes" : "Save patient"}
            </button>
            <button type="button" className="btn btn-outline" onClick={closeForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="pt-layout">
        {/* ---------- Patient list ---------- */}
        <aside className="card pt-panel">
          <header className="pt-panel-head">
            <h3><PatientsIcon size={18} /> Patients</h3>
            <span className="badge badge-muted">{filtered.length}</span>
          </header>

          <input
            className="pt-search"
            type="text"
            placeholder="Search by name, room or nationality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <ul className="pt-list">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  className={`pt-item ${p.id === selectedId ? "active" : ""}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span className="pt-avatar">{initials(p.name)}</span>
                  <span className="pt-item-main">
                    <strong>{p.name}</strong>
                    <span>Room {p.room} · {p.nationality}</span>
                  </span>
                  {hasAllergy(p.allergies) && <span className="pt-dot" title="Has allergies" />}
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && <p className="pt-empty">No patients found.</p>}
        </aside>

        {/* ---------- Patient record ---------- */}
        <article className="card pt-panel">
          {selected ? (
            <>
              <header className="pt-record-head">
                <span className="pt-avatar lg">{initials(selected.name)}</span>
                <div className="pt-record-title">
                  <h3>{selected.name}</h3>
                  <span className="pt-meta">
                    <PinIcon size={13} /> Room {selected.room}
                    <span className="badge badge-muted">{selected.nationality}</span>
                  </span>
                </div>
                <button className="btn btn-outline" onClick={startEdit}>
                  Edit
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/encounter?patient=${selected.id}`)}
                >
                  <EncounterIcon size={17} /> New encounter
                </button>
              </header>

              {hasAllergy(selected.allergies) && (
                <div className="pt-alert">
                  <AlertIcon size={18} />
                  <div>
                    <strong>Allergies</strong>
                    <span>{selected.allergies}</span>
                  </div>
                </div>
              )}

              <h4 className="pt-sub">Personal information</h4>
              <div className="pt-grid">
                <Field label="Age" value={selected.age} />
                <Field label="Sex" value={selected.gender} />
                <Field label="Date of birth" value={selected.dob} />
                <Field label="Nationality" value={selected.nationality} />
                <Field label="Passport / ID" value={selected.passport} />
                <Field label="Phone" value={selected.phone} />
                <Field label="Emergency contact" value={selected.emergencyContact} wide />
              </div>

              <h4 className="pt-sub">Stay & insurance</h4>
              <div className="pt-grid">
                <Field label="Hotel" value={selected.hotel} />
                <Field label="Room" value={selected.room} />
                <Field label="Arrival" value={selected.arrivalDate} />
                <Field label="Departure" value={selected.departureDate} />
                <Field label="Travel company" value={selected.travelCompany} />
                <Field label="Tour guide phone" value={selected.guidePhone} />
                <Field label="Home address" value={selected.address} wide />
                <Field
                  label="Insurance"
                  value={
                    selected.insurance
                      ? `Yes${selected.insuranceDetails ? ` - ${selected.insuranceDetails}` : ""}`
                      : yesNo(selected.insurance)
                  }
                  wide
                />
              </div>

              <h4 className="pt-sub">Medical information</h4>
              <div className="pt-grid">
                <Field label="Medical history" value={selected.medicalHistory} wide />
                <Field label="Current medications" value={selected.medications} wide />
                <Field label="Blood thinners" value={yesNo(selected.bloodThinners)} />
                {selected.gender === "Female" && (
                  <>
                    <Field label="Pregnant" value={yesNo(selected.pregnant)} />
                    <Field label="Breastfeeding" value={yesNo(selected.breastfeeding)} />
                  </>
                )}
              </div>

              {selected.intakeComplaints && selected.intakeComplaints.length > 0 && (
                <>
                  <h4 className="pt-sub">Reported on the intake form</h4>
                  <div className="pt-grid">
                    <Field
                      label="Today's complaint"
                      value={selected.intakeComplaints
                        .map((c) =>
                          c === "Another problem" && selected.intakeComplaintOther
                            ? `Another problem: ${selected.intakeComplaintOther}`
                            : c
                        )
                        .join(", ")}
                      wide
                    />
                  </div>
                </>
              )}

              <h4 className="pt-sub"><CalendarIcon size={16} /> Visit history</h4>
              {patientVisits.length === 0 ? (
                <p className="pt-empty">No visits recorded.</p>
              ) : (
                <div className="pt-table-wrap">
                  <table className="pt-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Complaint</th>
                        <th>Classification</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientVisits.map((v) => (
                        <tr key={v.id}>
                          <td className="muted">{v.date} {v.time}</td>
                          <td>{v.complaint}</td>
                          <td><span className="badge badge-muted">{v.classification}</span></td>
                          <td>
                            <span className={`badge badge-${visitBadge[v.status] || "muted"}`}>{v.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <p className="pt-empty">Select a patient to view the record.</p>
          )}
        </article>
      </section>
    </div>
  );
}

function PhoneField({ label, codeName, numberName, form, onChange }) {
  return (
    <div className="pt-phone-field">
      <span>{label}</span>
      <div className="pt-phone">
        <select
          aria-label={`${label} - country code`}
          value={form[codeName]}
          onChange={(e) => onChange(codeName, e.target.value)}
        >
          <option value="">Code…</option>
          {DIAL_CODES.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Number"
          aria-label={`${label} - number`}
          value={form[numberName]}
          onChange={(e) => onChange(numberName, e.target.value.replace(/\D/g, ""))}
        />
      </div>
    </div>
  );
}

function YesNo({ label, name, value, onChange, children }) {
  return (
    <div className="pt-yn">
      <span className="pt-yn-label">{label}</span>
      <div className="pt-yn-options" role="radiogroup" aria-label={label}>
        <label>
          <input type="radio" name={name} checked={value === true} onChange={() => onChange(name, true)} />
          Yes
        </label>
        <label>
          <input type="radio" name={name} checked={value === false} onChange={() => onChange(name, false)} />
          No
        </label>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, wide }) {
  return (
    <div className={`pt-field ${wide ? "wide" : ""}`}>
      <span className="pt-field-label">{label}</span>
      <span className="pt-field-value">{value || "-"}</span>
    </div>
  );
}

export default Patients;
