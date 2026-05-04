import { useMemo, useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Package, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Search,
  Bell,
  User,
  Loader2
} from 'lucide-react';
import { logoutAdmin, searchAdmin } from '../../lib/adminClient.js';

export default function AdminLayout({ adminUser, onLogout, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchAdmin(searchQuery);
        setSearchResults(data.results);
        setShowResults(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Inbox, label: 'Inquiries', path: '/admin/inquiries' },
    { icon: Users, label: 'Travelers', path: '/admin/travelers' },
    { icon: Package, label: 'Packages', path: '/admin/packages' },
    { icon: Calendar, label: 'Calendar', path: '/admin/calendar' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const currentNavLabel = useMemo(() => {
    return navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';
  }, [location.pathname]);

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="brand__mark" />
          <div className="brand__copy">
            <strong>everest</strong>
            <span>expeditions</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => 
                `admin-nav-item ${isActive ? 'is-active' : ''}`
              }
              end={item.path === '/admin'}
              key={item.path}
              to={item.path}
            >
              <div className="nav-icon-wrap">
                <item.icon size={18} />
              </div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-nav-item admin-nav-item--logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <h1 className="admin-header__title">{currentNavLabel}</h1>
            <div className="admin-header__search">
              <Search className="search-icon" size={18} />
              <input 
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                placeholder="Search anything..." 
                type="text" 
                value={searchQuery}
              />
              {isSearching && (
                <div className="search-loader">
                  <Loader2 className="animate-spin" size={16} />
                </div>
              )}
              {showResults && searchQuery.trim() && (
                <div className="search-results-overlay" onClick={() => setShowResults(false)} />
              )}
              {showResults && searchQuery.trim() && (
                <div className="search-results-dropdown">
                  {!isSearching && searchResults.length === 0 && (
                    <div className="search-no-results">No results found for "{searchQuery}"</div>
                  )}
                  {searchResults.map(result => (
                    <button 
                      className="search-result-item" 
                      key={result.id}
                      onClick={() => {
                        navigate('/admin/inquiries');
                        setShowResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="search-result-item__main">
                        <strong>{result.fullName}</strong>
                        <span>{result.email}</span>
                      </div>
                      <span className={`badge badge--status-${result.status} badge--mini`}>
                        {result.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="admin-header__right">
            <button className="icon-button">
              <Bell size={20} />
              <div className="notification-dot" />
            </button>
            <div className="admin-profile">
              <div className="admin-profile__info">
                <span className="profile-name">{adminUser?.displayName || adminUser?.username || 'Admin'}</span>
                <span className="profile-role">Senior Planner</span>
              </div>
              <div className="admin-profile__avatar">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <section className="admin-content">
          {children}
        </section>
      </main>
    </div>
  );
}
