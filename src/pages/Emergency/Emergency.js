
import React, { useState } from "react";
import "./Emergency.css";

function Emergency() {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [alerts, setAlerts] = useState([]);

  function sendAlert(event) {
    event.preventDefault();

    const newAlert = {
      id: Date.now(),
      type,
      location: location.trim(),
      description: description.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Active",
    };

    setAlerts((current) => [newAlert, ...current]);
    setType("");
    setLocation("");
    setDescription("");
    setMessage("Emergency alert recorded successfully.");
  }

  function resolveAlert(id) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );
  }

  return (
    <section className="emergency-page">
      <div className="emergency-page-heading">
        <span className="emergency-heading-arrow">←</span>
        <h2>Emergency Alert</h2>
      </div>

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

        <button className="btn btn-danger emergency-send-button" type="submit">
          <span aria-hidden="true">➤</span>
          Send Alert
        </button>
      </form>

      <div className="emergency-info-banner">
        <span className="emergency-info-icon" aria-hidden="true">
          ⓘ
        </span>
        <p>
          This alert will be sent to the clinic team and hotel security.
        </p>
        <span className="emergency-siren" aria-hidden="true">
          ♨
        </span>
      </div>

      {alerts.length > 0 && (
        <section className="emergency-recent-alerts">
          <div className="emergency-recent-heading">
            <h3>Recent Alerts</h3>
            <span>{alerts.length} incidents</span>
          </div>

          {alerts.map((alert) => (
            <article className="card emergency-alert-item" key={alert.id}>
              <div className="emergency-alert-item-heading">
                <span
                  className={`emergency-alert-dot ${
                    alert.status === "Active" ? "active" : "resolved"
                  }`}
                />
                <strong>{alert.type}</strong>
                <span
                  className={`emergency-status ${
                    alert.status === "Active" ? "active" : "resolved"
                  }`}
                >
                  {alert.status}
                </span>
              </div>

              <p className="emergency-alert-detail">
                Location: {alert.location}
              </p>
              <p className="emergency-alert-detail">
                {alert.description}
              </p>
              <p className="emergency-alert-time">{alert.time}</p>

              {alert.status === "Active" && (
                <button
                  type="button"
                  className="btn btn-outline emergency-resolve-button"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Mark as Resolved
                </button>
              )}
            </article>
          ))}
        </section>
      )}
    </section>
  );
}

export default Emergency;
