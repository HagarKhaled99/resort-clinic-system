
import React, { useState, useEffect } from 'react';
import { followUps, patients, todayISO } from '../../data/mockData';
import './FollowUps.css';

const filters = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed', 'Missed'];

const initialForm = () => ({
  patientId: '', date: todayISO(), time: '', reason: ''
});

function getStatus(a) {
  if (['Completed', 'Missed'].includes(a.status)) return a.status;
  if (a.date < todayISO()) return 'Overdue';
  if (a.date === todayISO()) return 'Today';
  return 'Upcoming';
}

export default function FollowUps() {

  // Load saved appointments
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('clinic-follow-ups'));
      return Array.isArray(saved) ? saved : followUps;
    } catch {
      return followUps;
    }
  });

  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  // Save appointments whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('clinic-follow-ups', JSON.stringify(appointments));
    } catch (error) {
      console.warn('Unable to save follow-ups:', error);
    }
  }, [appointments]);

  const filtered = appointments.filter(
    a => filter === 'All' || getStatus(a) === filter
  );

  function updateStatus(id, status) {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status } : a)
    );
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function closeForm() {
    setShowForm(false);
    setForm(initialForm());
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.patientId || !form.date || !form.time || !form.reason.trim()) return;

    setAppointments(prev => [...prev, {
      ...form,
      id: Math.max(0, ...prev.map(a => a.id)) + 1,
      patientId: Number(form.patientId),
      reason: form.reason.trim(),
      status: 'Pending'
    }]);

    closeForm();
    setFilter('All');
  }

  return (
    <div className="follow-ups-page">
      <div className="fu-header">
        <div>
          <h1>Follow-Ups</h1>
          <p>Manage patient follow-up appointments.</p>
        </div>

        <button type="button" className="fu-primary-btn"
          onClick={() => setShowForm(!showForm)}>
          + New follow-up
        </button>
      </div>

      {showForm && (
        <form className="fu-form" onSubmit={handleSubmit}>
          <h2>New follow-up appointment</h2>

          <label htmlFor="fu-patient">Patient</label>
          <select id="fu-patient" name="patientId"
            value={form.patientId} onChange={handleChange} required>
            <option value="">Select a patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - Room {p.room}
              </option>
            ))}
          </select>

          <div className="fu-form-row">
            {['date', 'time'].map(field => (
              <div key={field}>
                <label htmlFor={`fu-${field}`}>
                  {field === 'date' ? 'Date' : 'Time'}
                </label>
                <input id={`fu-${field}`} type={field} name={field}
                  value={form[field]} onChange={handleChange} required />
              </div>
            ))}
          </div>

          <label htmlFor="fu-reason">Reason for follow-up</label>
          <textarea id="fu-reason" name="reason" rows={3}
            placeholder="Enter reason for follow-up..."
            value={form.reason} onChange={handleChange} required />

          <div className="fu-form-actions">
            <button type="button" className="fu-cancel-btn"
              onClick={closeForm}>
              Cancel
            </button>

            <button type="submit" className="fu-primary-btn">
              Add follow-up
            </button>
          </div>
        </form>
      )}

      <div className="follow-up-filters">
        {filters.map(f => (
          <button key={f} type="button" aria-pressed={filter === f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="fu-table-wrapper">
        <table>
          <thead>
            <tr>
              {['Patient', 'Room', 'Date', 'Time', 'Reason', 'Status', 'Actions']
                .map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>

          <tbody>
            {filtered.map(a => {
              const p = patients.find(p => p.id === a.patientId);
              const status = getStatus(a);

              return (
                <tr key={a.id}>
                  <td>{p?.name}</td>
                  <td>{p?.room}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.reason}</td>

                  <td>
                    <span className={`fu-status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>

                  <td>
                    <select className="fu-status-select"
                      aria-label={`Change status for ${p?.name}`}
                      value={a.status || 'Pending'}
                      onChange={e => updateStatus(a.id, e.target.value)}>
                      {['Pending', 'Completed', 'Missed'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan={7} className="fu-empty">
                  No follow-up appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
