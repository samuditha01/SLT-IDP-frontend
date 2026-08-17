import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getClient,
  updateClient,
  deleteClient,
  rotateSecret,
} from '../services/developerService';

export default function AppDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [redirectUris, setRedirectUris] = useState(['']);

  const [newSecret, setNewSecret] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadClient = () => {
    setLoading(true);
    getClient(id)
      .then((c) => {
        setClient(c);
        setName(c.name);
        setDescription(c.description || '');
        setRedirectUris(c.redirectUris.length ? c.redirectUris : ['']);
      })
      .catch((err) => setError(err.response?.data?.error || 'Could not load app'))
      .finally(() => setLoading(false));
  };

  useEffect(loadClient, [id]);

  const handleUriChange = (i, value) => {
    const next = [...redirectUris];
    next[i] = value;
    setRedirectUris(next);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateClient(id, {
        name,
        description,
        redirectUris: redirectUris.filter((u) => u.trim() !== ''),
      });
      setClient(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleRotate = async () => {
    try {
      const res = await rotateSecret(id);
      setNewSecret(res.clientSecret);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to rotate secret');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete app');
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error && !client) return <p className="form-error">{error}</p>;
  if (!client) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{client.name}</h1>
          <p>
            {client.clientType.toUpperCase()} ·{' '}
            <span className={`badge badge-${client.status}`}>{client.status}</span>
          </p>
        </div>
        <Link to={`/apps/${id}/analytics`} className="btn btn-secondary">
          View analytics
        </Link>
      </div>

      {/* Credentials */}
      <div className="panel">
        <h2>Credentials</h2>
        <div className="form-hint" style={{ marginBottom: 8 }}>Client ID</div>
        <div className="credential-box">
          <span>{client.clientId}</span>
        </div>

        {client.clientType !== 'spa' && client.clientType !== 'mobile' && (
          <>
            {newSecret ? (
              <>
                <div className="secret-warning">
                  New secret generated. Copy it now — it won't be shown again. The old secret no
                  longer works.
                </div>
                <div className="credential-box">
                  <span>{newSecret}</span>
                </div>
              </>
            ) : (
              <button className="btn btn-secondary" onClick={handleRotate} style={{ marginTop: 4 }}>
                Rotate client secret
              </button>
            )}
          </>
        )}
      </div>

      {/* Edit details */}
      <form className="panel" onSubmit={handleSave}>
        <h2>App details</h2>

        <div className="form-group">
          <label htmlFor="name">App name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Redirect URIs</label>
          {redirectUris.map((uri, i) => (
            <div className="uri-row" key={i}>
              <input value={uri} onChange={(e) => handleUriChange(i, e.target.value)} />
            </div>
          ))}
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      {/* Danger zone */}
      <div className="panel" style={{ borderColor: 'var(--danger)' }}>
        <h2 style={{ color: 'var(--danger)' }}>Danger zone</h2>
        <p className="form-hint" style={{ marginBottom: 12 }}>
          Deleting this app immediately revokes all its tokens and cannot be undone.
        </p>
        <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
          Delete this app
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Delete "{client.name}"?</h2>
            <p>This will permanently remove the app and revoke all its active tokens.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
