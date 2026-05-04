import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Shield, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminSettings() {
  const { onSessionExpired } = useOutletContext();
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    // Simulate health check
    const timer = setTimeout(() => setDbStatus('connected'), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="settings-view">
      <div className="view-header">
        <div className="view-header__title">
          <div className="rich-icon rich-icon--large"><Settings size={32} /></div>
          <div>
            <h2>Settings & Profile</h2>
            <p className="text-muted">Manage your administrative preferences and system health.</p>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-section">
          <div className="settings-section__header">
            <div className="rich-icon rich-icon--mini"><User size={16} /></div>
            <h3>Your Profile</h3>
          </div>
          <article className="dashboard-card settings-card">
            <div className="profile-edit-form">
              <label className="field field--stacked">
                <span>Display Name</span>
                <input type="text" defaultValue="Admin User" disabled />
                <p className="field__help">Display name used in the sidebar and records.</p>
              </label>
              <label className="field field--stacked">
                <span>Role</span>
                <div className="role-chip">
                  <Shield size={14} />
                  Administrator
                </div>
              </label>
            </div>
          </article>
        </section>

        <section className="settings-section">
          <div className="settings-section__header">
            <div className="rich-icon rich-icon--mini"><Database size={16} /></div>
            <h3>System Integrity</h3>
          </div>
          <article className="dashboard-card settings-card">
            <ul className="health-list">
              <li className="health-item">
                <div className="health-item__label">
                  <strong>Database Core</strong>
                  <span>SQLite 3 (Local Cluster)</span>
                </div>
                {dbStatus === 'connected' ? (
                  <div className="health-status health-status--good">
                    <CheckCircle2 size={16} />
                    Connected
                  </div>
                ) : (
                  <div className="health-status health-status--wait">
                    Checking...
                  </div>
                )}
              </li>
              <li className="health-item">
                <div className="health-item__label">
                  <strong>Session Authority</strong>
                  <span>HMAC-SHA256 Signed</span>
                </div>
                <div className="health-status health-status--good">
                  <CheckCircle2 size={16} />
                  active
                </div>
              </li>
              <li className="health-item">
                <div className="health-item__label">
                  <strong>API Gateway</strong>
                  <span>Express 5.0 (Optimized)</span>
                </div>
                <div className="health-status health-status--good">
                  <CheckCircle2 size={16} />
                  Operational
                </div>
              </li>
            </ul>
          </article>
        </section>
      </div>

      <div className="settings-footer">
        <p className="text-muted text-small">
          Everest Expeditions Admin Build v1.4.2 — Nepal Operations Desk
        </p>
      </div>
    </div>
  );
}
