import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';
import {
  visits, followUps, medications, emergencyAlerts, getPatient, todayISO,
} from '../../data/mockData';
import {
  EncounterIcon, CalendarIcon, PillIcon, AlertIcon, PlusIcon,
  ClockIcon, PinIcon, ArrowRightIcon, PatientsIcon,
} from '../../components/Icons';
import './Dashboard.css';

// Days between today and a "YYYY-MM-DD" date (negative = in the past)
const daysFromToday = (iso) => {
  const t = new Date(todayISO());
  return Math.round((new Date(iso) - t) / 86400000);
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

// Decide what warning a medication needs (or null if it's fine)
const medicationStatus = (med) => {
  const days = daysFromToday(med.expiryDate);
  if (days < 0) return { label: 'Expired', tone: 'danger', order: 0 };
  if (days <= 30) return { label: `Expires in ${days} day${days === 1 ? '' : 's'}`, tone: 'warning', order: 1 };
  if (med.quantity < med.minQuantity) return { label: `Low stock · ${med.quantity} left`, tone: 'warning', order: 2 };
  return null;
};

const visitBadge = { Completed: 'success', 'In progress': 'info', Waiting: 'warning' };

function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const today = todayISO();

  const todaysVisits = visits.filter((v) => v.date === today);
  const todaysFollowUps = followUps
    .filter((f) => f.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  const medAlerts = medications
    .map((m) => ({ ...m, status: medicationStatus(m) }))
    .filter((m) => m.status)
    .sort((a, b) => a.status.order - b.status.order);
  const activeEmergencies = emergencyAlerts.filter((a) => a.status === 'Active');
  const recentAlerts = [...emergencyAlerts].slice(0, 3);

  const stats = [
    { label: "Today's visits", value: todaysVisits.length, hint: `${todaysVisits.filter((v) => v.status !== 'Completed').length} still open`, icon: EncounterIcon, tone: 'teal', to: '/encounter' },
    { label: 'Follow-ups today', value: todaysFollowUps.length, hint: 'Before guests check out', icon: CalendarIcon, tone: 'blue', to: '/patients' },
    { label: 'Medication alerts', value: medAlerts.length, hint: `${medAlerts.filter((m) => m.status.tone === 'danger').length} expired`, icon: PillIcon, tone: 'amber', to: '/medications' },
    { label: 'Active emergencies', value: activeEmergencies.length, hint: activeEmergencies.length ? 'Needs attention' : 'All clear', icon: AlertIcon, tone: 'red', to: '/emergency' },
  ];

  return (
    <div className="dashboard">
      {/* ---------- Welcome ---------- */}
      <section className="dash-welcome">
        <div>
          <h2>{greeting()}, {user?.name?.split(' ').slice(0, 2).join(' ')} 👋</h2>
          <p>Here is what's happening in the clinic today.</p>
        </div>
        <div className="dash-actions">
          <button className="btn btn-outline" onClick={() => navigate('/patients')}>
            <PlusIcon size={17} /> New patient
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/encounter')}>
            <EncounterIcon size={17} /> New visit
          </button>
        </div>
      </section>

      {/* ---------- Active emergency banner ---------- */}
      {activeEmergencies.map((a) => (
        <Link to="/emergency" key={a.id} className="emergency-banner">
          <span className="pulse"><AlertIcon size={20} /></span>
          <div>
            <strong>Emergency: {a.type}</strong>
            <span>{a.location} · {a.details} · {a.time}</span>
          </div>
          <span className="banner-cta">Open <ArrowRightIcon size={16} /></span>
        </Link>
      ))}

      {/* ---------- Stat cards ---------- */}
      <section className="stat-grid">
        {stats.map(({ label, value, hint, icon: Icon, tone, to }) => (
          <Link to={to} key={label} className={`card stat-card tone-${tone}`}>
            <span className="stat-icon"><Icon size={20} /></span>
            <div>
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
              <span className="stat-hint">{hint}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* ---------- Main panels ---------- */}
      <section className="dash-grid">
        {/* Today's follow-ups */}
        <article className="card panel">
          <header className="panel-head">
            <h3><CalendarIcon size={18} /> Today's follow-ups</h3>
            <Link to="/patients" className="panel-link">View all</Link>
          </header>
          {todaysFollowUps.length === 0 ? (
            <p className="empty">No follow-ups scheduled for today.</p>
          ) : (
            <ul className="list">
              {todaysFollowUps.map((f) => {
                const p = getPatient(f.patientId);
                const leaving = daysFromToday(p.checkOut);
                return (
                  <li key={f.id} className="list-row">
                    <span className="time-chip">{f.time}</span>
                    <div className="row-main">
                      <strong>{p.name}</strong>
                      <span>Room {p.room} · {f.reason}</span>
                      {leaving <= 1 && (
                        <span className="badge badge-warning row-badge">
                          {leaving <= 0 ? 'Checks out today' : 'Checks out tomorrow'}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        {/* Medication alerts */}
        <article className="card panel">
          <header className="panel-head">
            <h3><PillIcon size={18} /> Medication alerts</h3>
            <Link to="/medications" className="panel-link">Inventory</Link>
          </header>
          {medAlerts.length === 0 ? (
            <p className="empty">All medications are in stock and valid.</p>
          ) : (
            <ul className="list">
              {medAlerts.map((m) => (
                <li key={m.id} className="list-row">
                  <span className={`dot dot-${m.status.tone}`} />
                  <div className="row-main">
                    <strong>{m.name}</strong>
                    <span>{m.quantity} {m.form.toLowerCase()} · exp. {m.expiryDate}</span>
                  </div>
                  <span className={`badge badge-${m.status.tone}`}>{m.status.label}</span>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* Emergency alerts */}
        <article className="card panel panel-emergency">
          <header className="panel-head">
            <h3><AlertIcon size={18} /> Emergency alerts</h3>
            <Link to="/emergency" className="panel-link">All alerts</Link>
          </header>
          <ul className="list">
            {recentAlerts.map((a) => (
              <li key={a.id} className="list-row align-start">
                <span className={`dot dot-${a.status === 'Active' ? 'danger' : 'success'}`} />
                <div className="row-main">
                  <strong>{a.type}</strong>
                  <span className="meta">
                    <PinIcon size={13} /> {a.location}
                    <ClockIcon size={13} /> {a.date === today ? a.time : `Yesterday ${a.time}`}
                  </span>
                </div>
                <span className={`badge badge-${a.status === 'Active' ? 'danger' : 'success'}`}>{a.status}</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-danger panel-btn" onClick={() => navigate('/emergency')}>
            <AlertIcon size={16} /> Send emergency alert
          </button>
        </article>
        {/* Recent visits */}
        <article className="card panel panel-wide">
          <header className="panel-head">
            <h3><PatientsIcon size={18} /> Today's visits</h3>
            <Link to="/patients" className="panel-link">Patient records</Link>
          </header>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Room</th>
                  <th>Complaint</th>
                  <th>Classification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysVisits.map((v) => {
                  const p = getPatient(v.patientId);
                  return (
                    <tr key={v.id}>
                      <td className="muted">{v.time}</td>
                      <td>
                        <strong>{p.name}</strong>
                        <span className="sub">{p.nationality}</span>
                      </td>
                      <td>{p.room}</td>
                      <td>{v.complaint}</td>
                      <td><span className="badge badge-muted">{v.classification}</span></td>
                      <td><span className={`badge badge-${visitBadge[v.status]}`}>{v.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

      </section>
    </div>
  );
}

export default Dashboard;
