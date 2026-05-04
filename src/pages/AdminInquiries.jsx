import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { crmStatuses, inquiryStatuses } from '../../shared/admin.js';
import {
  Inbox,
  Search,
  Filter,
  User,
  Shield,
  Save,
  CheckCircle,
  Archive
} from 'lucide-react';
import {
  clearAdminSessionState,
  fetchAdminInquiries,
  updateAdminInquiry
} from '../lib/adminClient.js';
import { captureError } from '../lib/monitoring.js';

function formatDate(value) {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default function AdminInquiries() {
  const { onSessionExpired } = useOutletContext();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [selectedId, setSelectedId] = useState('');
  const [editorState, setEditorState] = useState({
    status: 'new',
    crmStatus: 'pending',
    assignedTo: '',
    adminNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveTone, setSaveTone] = useState('success');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminInquiries({
          query,
          status: statusFilter
        });

        if (!active) return;

        setInquiries(data.inquiries);
        setStats(data.stats);

        const nextSelectedId = data.inquiries.some((item) => item.id === selectedId)
          ? selectedId
          : data.inquiries[0]?.id ?? '';

        setSelectedId(nextSelectedId);
      } catch (error) {
        captureError(error, { source: 'admin_inquiries_load' });
        if (!active) return;

        if (error.status === 401) {
          onSessionExpired();
        } else {
          setSaveTone('error');
          setSaveMessage(error.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [query, statusFilter, onSessionExpired]);

  const selectedInquiry = useMemo(
    () => inquiries.find((item) => item.id === selectedId) ?? null,
    [inquiries, selectedId]
  );

  useEffect(() => {
    if (!selectedInquiry) return;
    setEditorState({
      status: selectedInquiry.status,
      crmStatus: selectedInquiry.crmStatus,
      assignedTo: selectedInquiry.assignedTo ?? '',
      adminNotes: selectedInquiry.adminNotes ?? ''
    });
    setSaveMessage('');
  }, [selectedInquiry]);

  const getStatusLabel = (value) => inquiryStatuses.find((item) => item.value === value)?.label ?? value;
  const getCrmStatusLabel = (value) => crmStatuses.find((item) => item.value === value)?.label ?? value;

  const handleQuickAction = async (action) => {
    if (!selectedInquiry) return;
    setSaving(true);
    setSaveMessage('');
    let updates = action === 'reviewed' ? { status: 'reviewed' } : { status: 'archived' };

    try {
      const data = await updateAdminInquiry({
        inquiryId: selectedInquiry.id,
        payload: { ...editorState, ...updates }
      });
      setInquiries((current) => current.map((item) => (item.id === data.inquiry.id ? data.inquiry : item)));
      setSaveTone('success');
      setSaveMessage(`Inquiry ${action === 'archive' ? 'archived' : 'marked as reviewed'}.`);
    } catch (error) {
      captureError(error, { source: 'admin_quick_action' });
      setSaveTone('error');
      setSaveMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedInquiry) return;
    setSaving(true);
    setSaveMessage('');

    try {
      const data = await updateAdminInquiry({
        inquiryId: selectedInquiry.id,
        payload: editorState
      });
      setInquiries((current) => current.map((item) => (item.id === data.inquiry.id ? data.inquiry : item)));
      setSaveTone('success');
      setSaveMessage('Inquiry updated.');
    } catch (error) {
      captureError(error, { source: 'admin_inquiry_update' });
      setSaveTone('error');
      setSaveMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-filters">
        <label className="field-group">
          <div className="rich-icon rich-icon--mini"><Search size={16} /></div>
          <input onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email..." type="search" value={query} />
        </label>
        <label className="field-group">
          <div className="rich-icon rich-icon--mini"><Filter size={16} /></div>
          <div className="select-wrap">
            <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
              <option value="all">Every status</option>
              {inquiryStatuses.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div className="admin-layout">
        <aside className="admin-list">
          {loading ? <p>Loading inquiries...</p> : null}
          {!loading && !inquiries.length ? <p>No match.</p> : null}
          {inquiries.map((inquiry) => (
            <button
              className={`admin-list__item ${selectedId === inquiry.id ? 'is-active' : ''}`}
              key={inquiry.id}
              onClick={() => setSelectedId(inquiry.id)}
            >
              <strong>{inquiry.fullName}</strong>
              <span>{inquiry.tripType}</span>
              <span>{formatDate(inquiry.receivedAt)}</span>
            </button>
          ))}
        </aside>

        <section className="admin-detail">
          {!selectedInquiry ? (
            <p>Select an inquiry to review.</p>
          ) : (
            <>
              <div className="admin-detail__header">
                <div>
                  <p className="eyebrow">{selectedInquiry.tripType}</p>
                  <h2>{selectedInquiry.fullName}</h2>
                </div>
                <div className="admin-tags">
                  <span className={`badge badge--status-${selectedInquiry.status}`}>{getStatusLabel(selectedInquiry.status)}</span>
                  <span className={`badge badge--crm-${selectedInquiry.crmStatus}`}>{getCrmStatusLabel(selectedInquiry.crmStatus)}</span>
                </div>
              </div>

              <div className="admin-actions">
                <button className="button-pill button-pill--secondary" disabled={saving} onClick={() => handleQuickAction('reviewed')}>
                  <CheckCircle size={16} /> Mark as Reviewed
                </button>
                <button className="button-pill button-pill--secondary" disabled={saving} onClick={() => handleQuickAction('archive')}>
                  <Archive size={16} /> Archive
                </button>
              </div>

              <div className="detail-grid detail-grid--pillars">
                <article className="detail-card">
                  <div className="detail-card__header">
                    <div className="rich-icon rich-icon--mini"><User size={16} /></div>
                    <h3>Contact</h3>
                  </div>
                  <p className="detail-card__value">{selectedInquiry.email}</p>
                </article>
                <article className="detail-card">
                  <div className="detail-card__header">
                    <div className="rich-icon rich-icon--mini"><Shield size={16} /></div>
                    <h3>Administrative</h3>
                  </div>
                  <p className="detail-card__value"><strong>Assigned:</strong> {selectedInquiry.assignedTo || 'Unassigned'}</p>
                </article>
              </div>

              <form className="admin-editor" onSubmit={handleSave}>
                <h3 className="admin-editor__title">Edit Records</h3>
                <div className="inquiry-grid">
                  <label className="field">
                    <span>Inquiry status</span>
                    <select onChange={(e) => setEditorState(c => ({ ...c, status: e.target.value }))} value={editorState.status}>
                      {inquiryStatuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span>Assigned to</span>
                    <input onChange={(e) => setEditorState(c => ({ ...c, assignedTo: e.target.value }))} type="text" value={editorState.assignedTo} />
                  </label>
                  <label className="field field--stacked">
                    <span>Admin notes</span>
                    <textarea onChange={(e) => setEditorState(c => ({ ...c, adminNotes: e.target.value }))} rows="5" value={editorState.adminNotes} />
                  </label>
                </div>
                {saveMessage && <p className={`form-status form-status--${saveTone}`}>{saveMessage}</p>}
                <button className="button-pill button-pill--primary" disabled={saving} type="submit">
                  {saving ? 'Saving...' : <><Save size={16} /> Save Record</>}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
