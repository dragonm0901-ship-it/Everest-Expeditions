import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Calendar,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { fetchAdminInquiries } from '../lib/adminClient.js';
import { captureError } from '../lib/monitoring.js';

function formatDate(value) {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium'
  }).format(new Date(value));
}

export default function AdminTravelers() {
  const { onSessionExpired } = useOutletContext();
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchAdminInquiries({ status: 'confirmed' });
        if (active) {
          setTravelers(data.inquiries);
          setError(null);
        }
      } catch (err) {
        captureError(err, { source: 'admin_travelers_load' });
        if (active) {
          if (err.status === 401) onSessionExpired();
          else setError(err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [onSessionExpired]);

  if (loading) return <div className="admin-loading-screen">Retrieving traveler manifest...</div>;

  return (
    <div className="travelers-view">
      <div className="view-header">
        <div className="view-header__title">
          <div className="rich-icon rich-icon--large"><Users size={32} /></div>
          <div>
            <h2>Traveler Directory</h2>
            <p className="text-muted">Manifest of all confirmed and ongoing journeys.</p>
          </div>
        </div>
      </div>

      {!travelers.length ? (
        <div className="empty-state">
          <div className="empty-state__icon"><Users size={48} /></div>
          <h3>No confirmed travelers yet</h3>
          <p>Go to the Inquiries workspace to confirm your first trip!</p>
        </div>
      ) : (
        <div className="traveler-list">
          {travelers.map((traveler) => (
            <article className="dashboard-card traveler-card" key={traveler.id}>
              <div className="traveler-card__main">
                <div className="traveler-avatar">
                  {traveler.fullName.charAt(0)}
                </div>
                <div className="traveler-info">
                  <h3>{traveler.fullName}</h3>
                  <span>{traveler.email}</span>
                </div>
              </div>

              <div className="traveler-card__details">
                <div className="detail-pill">
                  <div className="rich-icon rich-icon--mini"><MapPin size={14} /></div>
                  <span>{traveler.tripType}</span>
                </div>
                <div className="detail-pill">
                  <div className="rich-icon rich-icon--mini"><Calendar size={14} /></div>
                  <span>{formatDate(traveler.startDate)}</span>
                </div>
              </div>

              <div className="traveler-card__status">
                <div className="badge badge--status-confirmed badge--mini">
                  <CheckCircle size={12} />
                  Confirmed
                </div>
                <button className="icon-link-button">
                  <ExternalLink size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
