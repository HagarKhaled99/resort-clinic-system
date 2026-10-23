
import React, { useMemo, useState } from "react";
import "./Medications.css";

const initialMedications = [
  { id: 1, name: "Paracetamol", quantity: 50, expiry: "2026-12" },
  { id: 2, name: "Amoxicillin", quantity: 20, expiry: "2026-08" },
  { id: 3, name: "Metformin", quantity: 100, expiry: "2027-05" },
  { id: 4, name: "Ibuprofen", quantity: 30, expiry: "2026-11" },
  { id: 5, name: "Salbutamol", quantity: 15, expiry: "2027-03" },
  { id: 6, name: "Vitamin D", quantity: 40, expiry: "2027-02" },
];

function getMedicationStatus(med) {
  const today = new Date();
  const currentMonth = today.getFullYear() * 12 + today.getMonth();
  const [year, month] = med.expiry.split("-").map(Number);
  const expiryMonth = year * 12 + month - 1;

  if (expiryMonth < currentMonth) return "Expired";
  if (expiryMonth <= currentMonth + 2) return "Expiring";
  if (Number(med.quantity) <= 20) return "Low";
  return "Good";
}

function formatExpiry(expiry) {
  if (!expiry) return "—";
  const [year, month] = expiry.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-GB",
    { month: "short", year: "numeric" }
  );
}

function Medications() {
  const [medications, setMedications] = useState(initialMedications);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [message, setMessage] = useState("");

  const medicationRows = useMemo(
    () =>
      medications.map((med) => ({
        ...med,
        status: getMedicationStatus(med),
      })),
    [medications]
  );

  const stats = {
    total: medications.length,
    low: medicationRows.filter((med) => med.status === "Low").length,
    expiring: medicationRows.filter(
      (med) => med.status === "Expiring" || med.status === "Expired"
    ).length,
    units: medications.reduce((sum, med) => sum + Number(med.quantity), 0),
  };

  const filteredMedications = medicationRows.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || med.status === filter;
    return matchesSearch && matchesFilter;
  });

  function addMedication(event) {
    event.preventDefault();

    const newMedication = {
      id: Date.now(),
      name: name.trim(),
      quantity: Number(quantity),
      expiry,
    };

    setMedications((current) => [...current, newMedication]);
    setName("");
    setQuantity("");
    setExpiry("");
    setShowForm(false);
    setFilter("All");
    setSearch("");
    setMessage("Medication added to the demo inventory.");
  }

  function deleteMedication(id) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this medication?"
    );
    if (!confirmed) return;

    setMedications((current) => current.filter((med) => med.id !== id));
    setMessage("Medication removed from the demo inventory.");
  }

  return (
    <section className="medications-page">
      <div className="medications-hero">
        <div>
          
          <h2>Medication Inventory</h2>
          <p className="medications-subtitle">
            Keep track of clinic supplies, stock levels and expiry dates.
          </p>
        </div>

        <button
          className="btn btn-primary medications-add-button"
          onClick={() => {
            setShowForm((current) => !current);
            setMessage("");
          }}
        >
          <span aria-hidden="true">＋</span> Add Medication
        </button>
      </div>

      {message && (
        <p className="medications-message" role="status">
          <span aria-hidden="true">✓</span> {message}
        </p>
      )}

      <div className="medication-stats">
        <article className="medication-stat-card">
          <span className="medication-stat-icon ocean">✚</span>
          <div>
            <p>Total medicines</p>
            <strong>{stats.total}</strong>
            <span>Different items</span>
          </div>
        </article>

        <article className="medication-stat-card">
          <span className="medication-stat-icon teal">▤</span>
          <div>
            <p>Total units</p>
            <strong>{stats.units}</strong>
            <span>Units in stock</span>
          </div>
        </article>

        <article className="medication-stat-card">
          <span className="medication-stat-icon amber">!</span>
          <div>
            <p>Low stock</p>
            <strong>{stats.low}</strong>
            <span>Review stock levels</span>
          </div>
        </article>

        <article className="medication-stat-card">
          <span className="medication-stat-icon coral">◷</span>
          <div>
            <p>Expiry alerts</p>
            <strong>{stats.expiring}</strong>
            <span>Expired or expiring soon</span>
          </div>
        </article>
      </div>

      {stats.expiring > 0 && (
        <div className="medication-expiry-notice">
          <span aria-hidden="true">⚠</span>
          <div>
            <strong>Expiry review needed</strong>
            <p>
              Check medicines marked Expired or Expiring before use. Follow
              your clinic's medication-handling policy.
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <form className="card medication-form" onSubmit={addMedication}>
          <div className="medication-form-heading">
            <div>
              <h3>Add a medication</h3>
              <p>Enter the details for the clinic inventory.</p>
            </div>
            <button
              type="button"
              className="medication-close-button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <div className="medication-form-grid">
            <label>
              Medication name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paracetamol"
                required
              />
            </label>

            <label>
              Quantity (units)
              <input
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </label>

            <label>
              Expiry month
              <input
                type="month"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="medication-form-actions">
            <button type="submit" className="btn btn-primary">
              Save Medication
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card medication-table-card">
        <div className="medication-table-toolbar">
          <div>
            <h3>Stock overview</h3>
            <p>Search and review the current inventory.</p>
          </div>

          <label className="medication-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              aria-label="Search medicines"
            />
          </label>
        </div>

        <div className="medication-filters" aria-label="Filter medications">
          {["All", "Good", "Low", "Expiring", "Expired"].map((status) => (
            <button
              key={status}
              type="button"
              className={`medication-filter ${
                filter === status ? "selected" : ""
              }`}
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
            >
              {status}
              {status === "All" ? (
                <span>{medications.length}</span>
              ) : (
                <span>
                  {medicationRows.filter((med) => med.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="medication-table-wrapper">
          <table className="medication-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Quantity</th>
                <th>Expiry date</th>
                <th>Stock status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedications.map((med) => (
                <tr key={med.id}>
                  <td>
                    <span className="medication-name">
                      <span className="medication-pill-icon" aria-hidden="true">
                        ◈
                      </span>
                      <span>
                        <strong>{med.name}</strong>
                        <small>Clinic supply</small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <strong className="medication-quantity">
                      {med.quantity}
                    </strong>
                    <span className="medication-units"> units</span>
                  </td>
                  <td>{formatExpiry(med.expiry)}</td>
                  <td>
                    <span
                      className={`medication-status ${med.status.toLowerCase()}`}
                    >
                      <span aria-hidden="true">●</span> {med.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="medication-delete"
                      onClick={() => deleteMedication(med.id)}
                      aria-label={`Remove ${med.name}`}
                      title="Remove medication"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMedications.length === 0 && (
                <tr>
                  <td colSpan="5" className="medication-empty">
                    <span aria-hidden="true">⌕</span>
                    <strong>No medications found</strong>
                    <p>Try a different search or stock filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="medication-table-footer">
          <span>
            Showing {filteredMedications.length} of {medications.length} items
          </span>
          <span>Demo data · Not connected to a live inventory</span>
        </div>
      </div>
    </section>
  );
}

export default Medications;
