import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listClients } from '../services/developerService';

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function PortalDashboard() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listClients()
      .then(setClients)
      .catch((err) => setError(err.response?.data?.error || 'Could not load apps'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Apps</h1>
          <p>Applications registered to use "Login with SLT"</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          + Register New App
        </Link>
      </div>

      {loading && <p>Loading your apps…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && clients.length === 0 && (
        <div className="empty-state">
          <p>You haven't registered any applications yet.</p>
          <Link to="/create" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
            Register your first app
          </Link>
        </div>
      )}

      {!loading && clients.length > 0 && (
        <div className="card-grid">
          {clients.map((c) => (
            <Link to={`/apps/${c._id}`} className="app-card" key={c._id}>
              <div className="app-card-icon">{initials(c.name)}</div>
              <h3>{c.name}</h3>
              <div className="meta">{c.clientType.toUpperCase()} · {c.redirectUris.length} redirect URI(s)</div>
              <span className={`badge badge-${c.status}`}>{c.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
