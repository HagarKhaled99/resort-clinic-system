import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patients as initialPatients, visits } from "../../data/mockData";
import {
  PlusIcon, EncounterIcon, PinIcon, AlertIcon, PatientsIcon, CalendarIcon,
} from "../../components/Icons";
import "./Patients.css";

const emptyPatient = {
  name: "", age: "", gender: "Female", nationality: "", passport: "",
  phone: "", room: "", emergencyContact: "", medicalHistory: "",
  allergies: "", medications: "",
};

const visitBadge = { Completed: "success", "In progress": "info", Waiting: "warning" };

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const hasAllergy = (a) => a && String(a).toLowerCase() !== "none";

function Patients() {
  const [list, setList] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(initialPatients[0]?.id);
  const [showForm, setShowForm] = useState(false);
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = (e) => {
    e.preventDefault();
    const newPatient = {
      ...form,
      id: Date.now(),
      age: Number(form.age),
      allergies: form.allergies || "None",
    };
    setList([newPatient, ...list]);
    setSelectedId(newPatient.id);
    setForm(emptyPatient);
    setShowForm(false);
  };

  return (
    <div className="pt-page">
      {/* ---------- Header ---------- */}
      <section className="pt-head">
        <div>
          <h2>Patient Records</h2>
          <p>Search patients, add new ones and view their medical record.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <PlusIcon size={17} /> {showForm ? "Cancel" : "New patient"}
        </button>
      </section>

      {/* ---------- Add patient form ---------- */}
      {showForm && (
        <form className="card pt-panel pt-form" onSubmit={handleAdd}>
          <header className="pt-panel-head">
            <h3><PlusIcon size={18} /> New patient</h3>
          </header>
          <div className="pt-form-grid">
            <label>Full name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>Age
              <input name="age" type="number" min="0" value={form.age} onChange={handleChange} required />
            </label>
            <label>Gender
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option>Female</option>
                <option>Male</option>
              </select>
            </label>
            <label>Nationality
              <input name="nationality" value={form.nationality} onChange={handleChange} required />
            </label>
            <label>Passport / ID
              <input name="passport" value={form.passport} onChange={handleChange} />
            </label>
            <label>Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>Room
              <input name="room" value={form.room} onChange={handleChange} required />
            </label>
            <label>Emergency contact
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
            </label>
            <label className="wide">Medical history
              <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} />
            </label>
            <label className="wide">Allergies
              <input name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin, or leave empty" />
            </label>
            <label className="wide">Current medications
              <input name="medications" value={form.medications} onChange={handleChange} />
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Save patient</button>
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
                <Field label="Gender" value={selected.gender} />
                <Field label="Nationality" value={selected.nationality} />
                <Field label="Room" value={selected.room} />
                <Field label="Passport / ID" value={selected.passport} />
                <Field label="Phone" value={selected.phone} />
                <Field label="Emergency contact" value={selected.emergencyContact} wide />
              </div>

              <h4 className="pt-sub">Medical information</h4>
              <div className="pt-grid">
                <Field label="Medical history" value={selected.medicalHistory} wide />
                <Field label="Current medications" value={selected.medications} wide />
              </div>

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

function Field({ label, value, wide }) {
  return (
    <div className={`pt-field ${wide ? "wide" : ""}`}>
      <span className="pt-field-label">{label}</span>
      <span className="pt-field-value">{value || "-"}</span>
    </div>
  );
}

export default Patients;