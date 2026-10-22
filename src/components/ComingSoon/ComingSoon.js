// Temporary placeholder shown until a teammate builds her page.
import { useNavigate } from 'react-router-dom';

function ComingSoon({ title, owner, description }) {
  const navigate = useNavigate();
  return (
    <div className="card" style={{ padding: '56px 24px', textAlign: 'center', maxWidth: 560, margin: '40px auto' }}>
      <span className="badge badge-info">Assigned to {owner}</span>
      <h2 style={{ margin: '14px 0 8px', fontSize: 22 }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 22 }}>{description}</p>
      <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
}

export default ComingSoon;
