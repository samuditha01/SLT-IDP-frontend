import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClientAnalytics } from '../services/developerService';

export default function AppAnalytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClientAnalytics(id)
      .then(setData)
      .catch((err) => setError(err.response?.data?.error || 'Could not load analytics'));
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Token issuance overview for this app</p>
        </div>
        <Link to={`/apps/${id}`} className="btn btn-secondary">
          ← Back to app
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      {data && (
        <>
          <div className="stat-row">
            <div className="stat-box">
              <div className="value">{data.totalTokensIssued}</div>
              <div className="label">Total tokens issued</div>
            </div>
            <div className="stat-box">
              <div className="value">{data.activeTokens}</div>
              <div className="label">Active tokens</div>
            </div>
          </div>

          <div className="panel">
            <h2>Note</h2>
            <p className="form-hint">{data.note}</p>
          </div>
        </>
      )}
    </div>
  );
}
