
import React, { useState } from "react";
import { getCurrentUser, isDoctor, isNurse } from "../../utils/auth";
import {
  getEmergencyAlerts,
  saveEmergencyAlerts,
} from "../../utils/emergencyStorage";
import "./Emergency.css";

const STATUSES = [
  "Sent",
  "Acknowledged",
  "On the Way",
  "Completed",
];

function Emergency() {
  const user = getCurrentUser();
  const doctor = isDoctor();
  const nurse = isNurse();

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [alerts, setAlerts] = useState(() => getEmergencyAlerts());

  function sendAlert(event) {
    event.preventDefault();

    if (!nurse) return;

    const now = new Date();

    const newAlert = {
      id: Date.now(),
      type,
      location: location.trim(),
      description: description.trim(),
      sentBy: user.name,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Sent",
    };

    const updatedAlerts = [newAlert, ...alerts];

    setAlerts(updatedAlerts);
    saveEmergencyAlerts(updatedAlerts);

    setType("");
    setLocation("");
    setDescription("");
    setMessage("Emergency alert sent to the doctor successfully.");
  }

  function updateStatus(id) {
    if (!doctor) return;

    const updatedAlerts = alerts.map((alert) => {
      if (alert.id !== id) return alert;

      const currentIndex = STATUSES.indexOf(alert.status);

      if (currentIndex < 0 || currentIndex >= STATUSES.length - 1) {
        return alert;
      }

      return {
        ...alert,
        status: STATUSES[currentIndex + 1],
      };
    });

    setAlerts(updatedAlerts);
    saveEmergencyAlerts(updatedAlerts);
  }

  if (!doctor && !nurse) {
    return (
      <section className="emergency-page">
        <h2>You do not have permission to access this page.</h2>
      </section>
    );
  }

  return (
    <section className="emergency-page">
      <div className="emergency-page-heading">
        <span className="emergency-heading-arrow">←</span>
        <h2>{doctor ? "Emergency Cases" : "Emergency Alert"}</h2>
      </div>

      {nurse && (
        <>
          <form className="card emergency-form" onSubmit={sendAlert}>
            <label className="emergency-field">
              Emergency Type <span className="required">*</span>

              <span className="emergency-select-wrap">
                <span className="emergency-field-icon" aria-hidden="true">
                  ⚠
                </span>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Near drowning">Near drowning</option>
                  <option value="Fall / injury">Fall / injury</option>
                  <option value="Allergic reaction">Allergic reaction</option>
                  <option value="Medical emergency">Medical emergency</option>
                  <option value="Fire">Fire</option>
                  <option value="Other">Other</option>
                </select>
              </span>
            </label>

            <label className="emergency-field">
              Location <span className="required">*</span>

              <span className="emergency-input-wrap">
                <span className="emergency-field-icon" aria-hidden="true">
                  ⌖
                </span>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location..."
                  required
                />
              </span>
            </label>

            <label className="emergency-field">
              Description <span className="required">*</span>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                rows="5"
                required
              />
            </label>

            {message && (
              <p className="emergency-message" role="status">
                {message}
              </p>
            )}

            <button
              className="btn btn-danger emergency-send-button"
              type="submit"
            >
              <span aria-hidden="true">➤</span>
              Send Alert to Doctor
            </button>
          </form>

          <div className="emergency-info-banner">
            <span className="emergency-info-icon" aria-hidden="true">
              ⓘ
            </span>
            <p>
              Your emergency report will be saved and made available to the
              doctor.
            </p>
            <span className="emergency-siren" aria-hidden="true">
              ♨
            </span>
          </div>
        </>
      )}

      <section className="emergency-recent-alerts">
        <div className="emergency-recent-heading">
          <h3>{doctor ? "Incoming Emergency Reports" : "Emergency Reports"}</h3>
          <span>{alerts.length} incidents</span>
        </div>

        {alerts.length === 0 ? (
          <p className="emergency-message">No emergency reports yet.</p>
        ) : (
          alerts.map((alert) => {
            const currentIndex = STATUSES.indexOf(alert.status);
            const nextStatus = STATUSES[currentIndex + 1];

            return (
              <article
                className="card emergency-alert-item"
                key={alert.id}
              >
                <div className="emergency-alert-item-heading">
                  <span
                    className={`emergency-alert-dot ${
                      alert.status === "Completed" ? "resolved" : "active"
                    }`}
                  />

                  <strong>{alert.type}</strong>

                  <span
                    className={`emergency-status ${
                      alert.status === "Completed" ? "resolved" : "active"
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>

                <p className="emergency-alert-detail">
                  Location: {alert.location}
                </p>

                <p className="emergency-alert-detail">
                  {alert.description || alert.details}
                </p>

                <p className="emergency-alert-detail">
                  Sent by: {alert.sentBy || "Clinic staff"}
                </p>

                <p className="emergency-alert-time">
                  {alert.date} · {alert.time}
                </p>

                {doctor && nextStatus && currentIndex >= 0 && (
                  <button
                    type="button"
                    className="btn btn-outline emergency-resolve-button"
                    onClick={() => updateStatus(alert.id)}
                  >
                    {nextStatus === "Completed"
                      ? "Mark as Completed"
                      : `Update to ${nextStatus}`}
                  </button>
                )}
              </article>
            );
          })
        )}
      </section>
    </section>
  );
}

export default Emergency;
