import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '../../utils/auth';
import {
  LogoMark, UserIcon, LockIcon, EyeIcon, EyeOffIcon,
  PatientsIcon, PillIcon, AlertIcon, ChartIcon,
} from '../../components/Icons';
import './Login.css';

const features = [
  { icon: PatientsIcon, text: 'Electronic patient records & visit history' },
  { icon: PillIcon, text: 'Medication stock with expiry warnings' },
  { icon: AlertIcon, text: 'Instant emergency alerts with location' },
  { icon: ChartIcon, text: 'Automatic monthly statistics for the hotel' },
];

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('doctor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in? Go straight to the dashboard.
  if (getCurrentUser()) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    // Small delay to feel like a real request (remove when backend is added)
    setTimeout(() => {
      const result = login(username, password, role);
      setLoading(false);
      if (result.ok) navigate('/dashboard', { replace: true });
      else setError(result.message);
    }, 500);
  };

  const fillDemo = (demoRole) => {
    setRole(demoRole);
    setUsername(demoRole);
    setPassword('1234');
    setError('');
  };

  return (
    <div className="login-page">
      {/* ---------- Left: brand panel ---------- */}
      <section className="login-hero">
        <div className="hero-brand">
          <LogoMark size={44} />
          <span>Resort Clinic</span>
        </div>

        <div className="hero-text">
          <h1>Care for every guest, <br />wherever they are in the resort.</h1>
          <p>The clinic's local system for records, follow-ups, medications and emergencies.</p>
        </div>

        <ul className="hero-features">
          {features.map(({ icon: Icon, text }) => (
            <li key={text}>
              <span><Icon size={18} /></span>
              {text}
            </li>
          ))}
        </ul>

        <small className="hero-foot">Runs on the clinic's local network · Guest data stays private</small>
      </section>

      {/* ---------- Right: form ---------- */}
      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-mobile-brand">
            <LogoMark size={40} />
          </div>

          <h2>Welcome back</h2>
          <p className="login-sub">Sign in to continue to the clinic system</p>

          <div className="role-switch" role="tablist" aria-label="Sign in as">
            {['doctor', 'nurse'].map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={role === r}
                className={role === r ? 'active' : ''}
                onClick={() => { setRole(r); setError(''); }}
              >
                {r === 'doctor' ? 'Doctor' : 'Nurse'}
              </button>
            ))}
          </div>

          <label className="field">
            <span>Username</span>
            <div className="input-wrap">
              <UserIcon size={18} />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-wrap">
              <LockIcon size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </label>

          {error && <div className="login-error" role="alert">{error}</div>}

          <button className="btn btn-primary login-submit" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : `Sign in as ${role === 'doctor' ? 'Doctor' : 'Nurse'}`}
          </button>

          <div className="demo-box">
            <span>Demo accounts (password 1234):</span>
            <div>
              <button type="button" onClick={() => fillDemo('doctor')}>doctor</button>
              <button type="button" onClick={() => fillDemo('nurse')}>nurse</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
