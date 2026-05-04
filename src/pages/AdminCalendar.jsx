import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  User
} from 'lucide-react';
import { fetchAdminInquiries } from '../lib/adminClient.js';

function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="real-time-clock">
      <span className="real-time-clock__time">
        {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="real-time-clock__date">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </span>
    </div>
  );
}

export default function AdminCalendar() {
  const { onSessionExpired } = useOutletContext();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminInquiries({ status: 'all' });
        setInquiries(data.inquiries);
      } catch (err) {
        if (err.status === 401) onSessionExpired();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [onSessionExpired]);

  const changeMonth = (offset) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + offset);
    setViewDate(next);
  };

  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const cells = [];
    
    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, dimmed: true, date: new Date(year, month - 1, daysInPrevMonth - i) });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ day: i, dimmed: false, date: new Date(year, month, i) });
    }
    
    // Next month padding
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, dimmed: true, date: new Date(year, month + 1, i) });
    }
    
    return cells;
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = new Date().toDateString();
  
  if (loading) return <div className="admin-loading-screen">Syncing travel dates...</div>;

  return (
    <div className="calendar-view">
      <div className="view-header">
        <div className="view-header__title">
          <div className="rich-icon rich-icon--large"><CalendarIcon size={32} /></div>
          <div>
            <h2>Departure Calendar</h2>
            <p className="text-muted">Overview of planned traveler start dates and arrival windows.</p>
          </div>
        </div>
        <div className="calendar-header-meta">
          <RealTimeClock />
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid--charts">
        <article className="dashboard-card dashboard-card--large">
          <div className="dashboard-card__header">
            <div className="calendar-controls">
              <button className="icon-button" onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
              <h3 style={{ minWidth: '180px', textAlign: 'center' }}>
                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <button className="icon-button" onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
            </div>
            <button className="button-pill button-pill--secondary" onClick={() => setViewDate(new Date())}>Today</button>
          </div>

          <div className="calendar-grid-wrapper">
            <div className="calendar-days-row">
              {days.map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="calendar-dates-grid">
              {getCalendarDays().map((cell, i) => {
                const isToday = cell.date.toDateString() === todayStr;
                const events = inquiries.filter(iq => iq.startDate && new Date(iq.startDate).toDateString() === cell.date.toDateString());
                
                return (
                  <div className={`calendar-date ${cell.dimmed ? 'is-dimmed' : ''} ${isToday ? 'is-today' : ''}`} key={i}>
                    <span className="date-number">{cell.day}</span>
                    <div className="calendar-events-stack">
                      {events.map(ev => (
                        <div className="event-pill" key={ev.id} title={ev.fullName}>
                          {ev.fullName.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Upcoming Arrivals</h3>
          </div>
          <div className="dashboard-card__body overflow-list">
             {inquiries
               .filter(iq => iq.startDate && new Date(iq.startDate) >= new Date())
               .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
               .slice(0, 8)
               .map(iq => (
                <div className="workflow-item" key={iq.id}>
                  <div className="rich-icon rich-icon--mini"><User size={16} /></div>
                  <div className="workflow-text">
                    <strong>{iq.fullName}</strong>
                    <span>Arriving {new Date(iq.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
             ))}
             {!inquiries.length && <p className="text-muted">No upcoming arrivals found.</p>}
          </div>
        </article>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .calendar-controls { display: flex; align-items: center; gap: 1rem; }
        .calendar-days-row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 700; color: #64748B; padding: 1rem 0; background: #F8FAFC; border-radius: 12px 12px 0 0; }
        .calendar-dates-grid { display: grid; grid-template-columns: repeat(7, 1fr); border-top: 1px solid #F1F5F9; border-left: 1px solid #F1F5F9; }
        .calendar-date { min-height: 120px; padding: 0.8rem; border-right: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9; display: flex; flex-direction: column; gap: 0.5rem; }
        .date-number { font-size: 0.9rem; font-weight: 700; color: #94A3B8; }
        .calendar-events-stack { display: flex; flex-direction: column; gap: 4px; }
        .event-pill { background: var(--brand-primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .is-dimmed { opacity: 0.3; background: #FAFBFC; }
        .is-today { background: rgba(47, 125, 244, 0.03); }
        .is-today .date-number { color: var(--brand-primary); background: rgba(47, 125, 244, 0.1); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
      `}} />
    </div>
  );
}
