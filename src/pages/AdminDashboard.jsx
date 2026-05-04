import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MapPin, 
  Inbox,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';
import { fetchAdminStats } from '../lib/adminClient.js';
import { captureError } from '../lib/monitoring.js';

function StatCard({ icon: Icon, label, value, trend, color }) {
  return (
    <article className="dashboard-card stat-metric">
      <div className={`stat-metric__icon stat-metric__icon--${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-metric__content">
        <span className="stat-metric__label">{label}</span>
        <div className="stat-metric__value-row">
          <span className="stat-metric__value">{value}</span>
          {trend && (
            <span className={`stat-metric__trend stat-metric__trend--${trend > 0 ? 'up' : 'down'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function InteractiveBarChart({ data, mode = 'count' }) {
  if (!data?.length) return <div className="chart-placeholder">No data available</div>;

  const getValue = (d) => d[mode];
  const max = Math.max(...data.map(getValue), mode === 'revenue' ? 10000 : 5);
  const width = 600;
  const height = 200;
  const padding = 20;
  const barGap = 12;
  const barWidth = (width - padding * 2 - barGap * (data.length - 1)) / data.length;

  return (
    <svg className="interactive-bar-chart" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-light)" />
          <stop offset="100%" stopColor="var(--brand-primary)" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const val = getValue(d);
        const barHeight = (val / max) * (height - padding * 2);
        const x = padding + i * (barWidth + barGap);
        const y = height - padding - barHeight;

        return (
          <g className="chart-bar-group" key={i}>
            <rect
              className="chart-bar"
              fill="url(#barGradient)"
              height={barHeight}
              rx="6"
              width={barWidth}
              x={x}
              y={y}
            >
              <animate attributeName="height" dur="0.6s" from="0" to={barHeight} />
              <animate attributeName="y" dur="0.6s" from={height - padding} to={y} />
            </rect>
            {/* Hit area for tooltips */}
            <rect
              className="chart-bar-hit"
              fill="transparent"
              height={height}
              onMouseEnter={(e) => {
                const tooltip = e.currentTarget.parentElement.querySelector('.chart-bar-tooltip');
                if (tooltip) tooltip.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const tooltip = e.currentTarget.parentElement.querySelector('.chart-bar-tooltip');
                if (tooltip) tooltip.style.opacity = '0';
              }}
              width={barWidth + barGap}
              x={x - barGap / 2}
              y={0}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartMode, setChartMode] = useState('count'); // 'count' | 'revenue'

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        if (active) {
          setStats(data.stats);
          setError(null);
        }
      } catch (err) {
        captureError(err, { source: 'admin_dashboard_stats' });
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="dashboard-loading">Preparing your workspace...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  const formatValue = (val) => {
    if (chartMode === 'revenue') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(val);
    }
    return `${val} inquiries`;
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);

  return (
    <div className="dashboard-home">
      {/* Top row: Metrics */}
      <div className="dashboard-grid dashboard-grid--metrics">
        <StatCard 
          color="blue"
          icon={Inbox} 
          label="Total Inquiries" 
          trend={stats.trends.volume}
          value={stats.summary.total} 
        />
        <StatCard 
          color="green"
          icon={TrendingUp} 
          label="Potential Revenue" 
          trend={stats.trends.revenue}
          value={formatCurrency(stats.revenue)} 
        />
        <StatCard 
          color="purple"
          icon={Users} 
          label="Active Travelers" 
          value={stats.summary.confirmed || 0} 
        />
        <StatCard 
          color="orange"
          icon={Clock} 
          label="Pending Review" 
          value={stats.summary.new || 0} 
        />
      </div>

      {/* Middle row: Charts */}
      <div className="dashboard-grid dashboard-grid--charts">
        <article className="dashboard-card dashboard-card--large">
          <div className="dashboard-card__header">
            <div>
              <h3>Analytics Overview</h3>
              <p className="text-muted text-small">Last 7 days of operational data</p>
            </div>
            <div className="chart-controls">
              <button 
                className={`chart-control-btn ${chartMode === 'count' ? 'is-active' : ''}`}
                onClick={() => setChartMode('count')}
              >
                Inquiries
              </button>
              <button 
                className={`chart-control-btn ${chartMode === 'revenue' ? 'is-active' : ''}`}
                onClick={() => setChartMode('revenue')}
              >
                Revenue
              </button>
            </div>
          </div>
          <div className="dashboard-card__body relative">
            <InteractiveBarChart data={stats.volume} mode={chartMode} />
            <div className="chart-labels chart-labels--bars">
              {stats.volume.map((d, i) => (
                <div className="chart-label-group" key={i}>
                  <div className="chart-tooltip chart-bar-tooltip">
                    <strong>{formatValue(d[chartMode])}</strong>
                    <span>{new Date(d.day).toLocaleDateString()}</span>
                  </div>
                  <span>{new Date(d.day).toLocaleDateString('en', { weekday: 'short' })}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Top Destinations</h3>
          </div>
          <div className="dashboard-card__body">
            <ul className="dest-list">
              {stats.destinations.map((dest, i) => (
                <li className="dest-item" key={i}>
                  <div className="dest-item__info">
                    <MapPin size={16} />
                    <span>{dest.name}</span>
                  </div>
                  <div className="dest-item__bar-wrap">
                    <div 
                      className="dest-item__bar" 
                      style={{ width: `${(dest.count / stats.destinations[0].count) * 100}%` }} 
                    />
                    <span className="dest-item__count">{dest.count}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      {/* Bottom row: Status & Activity */}
      <div className="dashboard-grid dashboard-grid--activity">
        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Workflow Lifecycle</h3>
          </div>
          <div className="dashboard-card__body overflow-list">
            <div className="workflow-item">
              <div className="rich-icon rich-icon--mini"><Inbox size={16} /></div>
              <div className="workflow-text">
                <strong>New Inquiries</strong>
                <span>{stats.summary.new || 0} awaiting review</span>
              </div>
            </div>
            <div className="workflow-item">
              <div className="rich-icon rich-icon--mini" style={{ background: '#10B981' }}><CheckCircle size={16} /></div>
              <div className="workflow-text">
                <strong>In Review</strong>
                <span>{stats.summary.reviewed || 0} being polished</span>
              </div>
            </div>
            <div className="workflow-item">
              <div className="rich-icon rich-icon--mini" style={{ background: '#64748B' }}><Archive size={16} /></div>
              <div className="workflow-text">
                <strong>Archived</strong>
                <span>{stats.summary.archived || 0} past journeys</span>
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Recent Growth</h3>
          </div>
          <div className="dashboard-card__body growth-summary">
            <div className="growth-score">94%</div>
            <p>Customer fit score this month</p>
            <div className="growth-tags">
              <span>High Quality Lead</span>
              <span>Fast Response</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
