import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../services/developerService';

const CLIENT_TYPES = [
  { value: 'web', label: 'Web app (has a secure backend)' },
  { value: 'spa', label: 'Single Page App (public, uses PKCE)' },
  { value: 'mobile', label: 'Mobile app (public, uses PKCE)' },
  { value: 'service', label: 'Service / machine-to-machine' },
];

export default function CreateAppWizard() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientType, setClientType] = useState('web');
  const [redirectUris, setRedirectUris] = useState(['']);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // New app's secret is shown once, right after creation
  const [createdApp, setCreatedApp] = useState(null);

  const updateUri = (index, value) => {
    const next = [...redirectUris];
    next[index] = value;
    setRedirectUris(next);
  };

  const addUriField = () => setRedirectUris([...redirectUris, '']);
  const removeUriField = (index) =>
    setRedirectUris(redirectUris.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const client = await createClient({
        name,
        description,
        clientType,
        redirectUris: redirectUris.filter((u) => u.trim() !== ''),
      });
      setCreatedApp(client);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register the app. Check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Success screen: show credentials once ---
  if (createdApp) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>App registered</h1>
            <p>Save these credentials now — the secret won't be shown again.</p>
          </div>
        </div>

        <div className="panel">
          {createdApp.clientSecret && (
            <div className="secret-warning">
              This is the only time your client secret is shown. Copy it somewhere safe.
            </div>
          )}

          <h2>Client ID</h2>
          <div className="credential-box">
            <span>{createdApp.clientId}</span>
          </div>

          {createdApp.clientSecret && (
            <>
              <h2>Client Secret</h2>
              <div className="credential-box">
                <span>{createdApp.clientSecret}</span>
              </div>
            </>
          )}

          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
            Done — go to My Apps
          </button>
        </div>
      </div>
    );
  }

  // --- Registration form ---
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Register a new app</h1>
          <p>Set up "Login with SLT" for your application</p>
        </div>
      </div>

      <form className="panel" onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label htmlFor="name">App name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Partner Website"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this app do?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientType">Application type</label>
          <select id="clientType" value={clientType} onChange={(e) => setClientType(e.target.value)}>
            {CLIENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className="form-hint">
            SPA and mobile apps don't receive a client secret — they use PKCE instead.
          </div>
        </div>

        <div className="form-group">
          <label>Redirect URIs</label>
          {redirectUris.map((uri, i) => (
            <div className="uri-row" key={i}>
              <input
                value={uri}
                onChange={(e) => updateUri(i, e.target.value)}
                placeholder="https://yourapp.com/callback"
              />
              {redirectUris.length > 1 && (
                <button type="button" className="btn btn-text" onClick={() => removeUriField(i)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-text" onClick={addUriField}>
            + Add another redirect URI
          </button>
          <div className="form-hint">Must be HTTPS in production. Exact match is required.</div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div style={{ marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register app'}
          </button>
        </div>
      </form>
    </div>
  );
}
