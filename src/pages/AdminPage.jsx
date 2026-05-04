import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import {
  clearAdminSessionState,
  fetchAdminSession,
  loginAdmin
} from '../lib/adminClient.js';
import { captureError } from '../lib/monitoring.js';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const session = await fetchAdminSession();
        if (active) {
          setAuthenticated(true);
          setAdminUser(session.user ?? null);
          setAuthError('');
        }
      } catch (error) {
        if (active) {
          setAuthenticated(false);
          setAdminUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();
    return () => { active = false; };
  }, []);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setAuthError('Enter both username and password.');
      return;
    }

    setAuthError('');
    try {
      const session = await loginAdmin({
        username: username.trim(),
        password
      });

      setAuthenticated(true);
      setAdminUser(session.user ?? null);
      setAuthError('');
      setPassword('');
    } catch (error) {
      captureError(error, { source: 'admin_login' });
      setAuthError(error.message);
    }
  };

  const handleSessionExpired = () => {
    clearAdminSessionState();
    setAuthenticated(false);
    setAdminUser(null);
    setAuthError('Your session expired. Please sign in again.');
  };

  if (loading) {
    return <div className="admin-loading-screen">Verifying gateway...</div>;
  }

  if (!authenticated) {
    return (
      <div className="page-shell">
        <Seo path="/admin" robots="noindex,nofollow" title="Admin Login" />
        <section className="section-block section-block--light">
          <div className="section-container admin-auth">
            <p className="eyebrow">Internal Gateway</p>
            <h1 className="section-title">Staff Portal</h1>
            <p>Authorized access only. Use your standard credentials.</p>
            <form className="admin-auth__form" onSubmit={handleAdminLogin}>
              <label className="field field--stacked">
                <span>Username</span>
                <input onChange={(e) => setUsername(e.target.value)} type="text" value={username} />
              </label>
              <label className="field field--stacked">
                <span>Password</span>
                <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} />
              </label>
              {authError ? <p className="form-status form-status--error">{authError}</p> : null}
              <button className="button-pill button-pill--primary" type="submit">
                <span className="button-pill__label">Open workspace</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <Seo path="/admin" robots="noindex,nofollow" title="Admin Dashboard" />
      <AdminLayout 
        adminUser={adminUser} 
        onLogout={() => {
          setAuthenticated(false);
          setAdminUser(null);
          navigate('/admin');
        }}
      >
        <Outlet context={{ onSessionExpired: handleSessionExpired }} />
      </AdminLayout>
    </>
  );
}
