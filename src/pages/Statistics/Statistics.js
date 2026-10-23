import React from 'react';
import './Statistics.css';
import {
  patients,
  visits,
  emergencyAlerts,
  caseClassifications,
  getPatient,
} from '../../data/mockData';

const StatIcon = ({ children, tone }) => (
  <span className={`stat-icon ${tone}`} aria-hidden="true">
    {children}
  </span>
);

function MetricCard({ title, value, change, caption, icon, tone }) {
  const positive = change >= 0;

  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <span className="metric-label">{title}</span>
        <StatIcon tone={tone}>{icon}</StatIcon>
      </div>
      <div className="metric-value">{value.toLocaleString()}</div>
      <div className="metric-foot">
        <span className={`metric-change ${positive ? 'up' : 'down'}`}>
          {positive ? '↗' : '↘'} {Math.abs(change)}%
        </span>
        <span className="metric-caption">{caption}</span>
      </div>
    </article>
  );
}

export default function Statistics() {
  const encounterTypes = caseClassifications.map((label, index) => ({
    label,
    count: visits.filter((visit) => visit.classification === label).length,
    color: [
      '#5486f5',
      '#32b59a',
      '#a78bfa',
      '#f5a623',
      '#ef7185',
      '#38bdf8',
      '#9ca3af',
    ][index],
  }));

  const totalTypeCount = encounterTypes.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const donutStops = encounterTypes.reduce(
    (acc, item) => {
      const start = acc.total;
      const end =
        totalTypeCount > 0
          ? start + (item.count / totalTypeCount) * 100
          : start;

      acc.parts.push(`${item.color} ${start}% ${end}%`);
      acc.total = end;
      return acc;
    },
    { total: 0, parts: [] }
  ).parts.join(', ');

  const weeklyVisits = [
    { label: 'Week 1', visits: 0 },
    { label: 'Week 2', visits: 0 },
    { label: 'Week 3', visits: 0 },
    { label: 'Week 4', visits: 0 },
  ];

  visits.forEach((visit) => {
    if (!visit?.date) return;
    const day = parseInt(visit.date.slice(-2), 10);
    if (!isNaN(day) && day >= 1) {
      const weekIndex = Math.min(3, Math.max(0, Math.floor((day - 1) / 7)));
      weeklyVisits[weekIndex].visits += 1;
    }
  });

  const maxVisits = Math.max(
    1,
    ...weeklyVisits.map((item) => item.visits)
  );

  const recentActivity = [...visits]
    .sort((a, b) => {
      const dateComparison = (b.date || '').localeCompare(a.date || '');
      return dateComparison || (b.time || '').localeCompare(a.time || '');
    })
    .slice(0, 5)
    .map((visit) => ({
      id: visit.id,
      name: getPatient(visit.patientId)?.name || 'Unknown patient',
      type: visit.classification,
      date: visit.date,
      status: visit.status,
    }));

  const currentMonth = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const totalPatients = patients.length;
  const newPatients = patients.filter((patient) => {
    if (!patient?.checkIn) return false;
    const checkIn = new Date(`${patient.checkIn}T00:00:00`);
    const now = new Date();
    if (isNaN(checkIn.getTime())) return false;

    return (
      checkIn.getMonth() === now.getMonth() &&
      checkIn.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <main className="statistics-page">
      <header className="statistics-header">
        <div>
          <p className="eyebrow">CLINIC OVERVIEW</p>
          <h1>Monthly Statistics</h1>
          <p className="page-subtitle">
            A snapshot of your clinic's activity and patient care.
          </p>
        </div>
        <div className="period-pill">
          <span className="period-dot" /> {currentMonth}
        </div>
      </header>

      <section
        className="metrics-grid"
        aria-label="Monthly key performance indicators"
      >
        <MetricCard
          title="Total Patients"
          value={totalPatients}
          change={0}
          caption="Sample records"
          icon="♙"
          tone="blue"
        />
        <MetricCard
          title="Clinical Encounters"
          value={visits.length}
          change={0}
          caption="Sample visits"
          icon="+"
          tone="green"
        />
        <MetricCard
          title="New Patients"
          value={newPatients}
          change={0}
          caption="Checked in this month"
          icon="✓"
          tone="purple"
        />
        <MetricCard
          title="Emergency Cases"
          value={emergencyAlerts.length}
          change={0}
          caption="Sample alerts"
          icon="♡"
          tone="orange"
        />
      </section>

      <section className="analytics-grid">
        <article className="panel visits-panel">
          <div className="panel-heading">
            <div>
              <h2>Patient Visits</h2>
              <p>Weekly visit volume for this month</p>
            </div>
            <span className="panel-menu" aria-hidden="true">
              •••
            </span>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-dot blue-dot" /> Patient visits
            </span>
            <strong>
              {weeklyVisits.reduce((sum, item) => sum + item.visits, 0)} visits
            </strong>
          </div>

          <div
            className="bar-chart"
            role="img"
            aria-label="Bar chart of patient visits by week"
          >
            {weeklyVisits.map((item) => (
              <div className="bar-column" key={item.label}>
                <span className="bar-value">{item.visits}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${(item.visits / maxVisits) * 100}%`,
                    }}
                  />
                </div>
                <span className="bar-label">{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel encounters-panel">
          <div className="panel-heading">
            <div>
              <h2>Encounter Breakdown</h2>
              <p>Types of clinical encounters</p>
            </div>
            <span className="panel-menu" aria-hidden="true">
              •••
            </span>
          </div>

          <div className="donut-layout">
            <div
              className="donut-chart"
              style={{
                background:
                  totalTypeCount > 0
                    ? `conic-gradient(${donutStops})`
                    : '#e5e7eb',
              }}
              role="img"
              aria-label="Donut chart showing encounter types"
            >
              <div className="donut-hole">
                <strong>{totalTypeCount}</strong>
                <span>encounters</span>
              </div>
            </div>

            <div className="donut-legend">
              {encounterTypes
                .filter((item) => item.count > 0)
                .map((item) => (
                  <div className="legend-row" key={item.label}>
                    <span className="legend-name">
                      <i
                        className="legend-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </span>
                    <strong>{item.count}</strong>
                  </div>
                ))}
            </div>
          </div>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-heading activity-heading">
          <div>
            <h2>Recent Clinical Activity</h2>
            <p>Latest sample records from the clinic</p>
          </div>
          <button
            className="text-button"
            type="button"
            onClick={() => window.print()}
          >
            Print report ↗
          </button>
        </div>

        <div className="table-scroll">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Encounter type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="patient-avatar">
                      {(item.name || '')
                        .split(' ')
                        .filter(Boolean)
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('') || 'PT'}
                    </span>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className="status-pill">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="demo-note">
          Demo dashboard · figures are based on sample data, not real patient
          records.
        </p>
      </section>
    </main>
  );
}