
import { NavLink, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  MessageCircle,
  ChartNoAxesColumn,
  UserRound,
  LogOut,
  PlusCircle,
  Bookmark
} from 'lucide-react';

import Brand from './Brand';
import { getUser, clearUser } from '../data';

export default function DashboardLayout({ children }) {
  const user = getUser() || {
    name: 'MuseNest User',
    role: 'user'
  };

  const navigate = useNavigate();
  const role = user.role;

  const links =
    role === 'admin'
      ? [
          ['Dashboard', '/dashboard', LayoutDashboard],
          ['Articles', '/articles', FileText],
          ['Users', null, Users],
          ['Categories', null, FolderOpen],
          ['Comments', null, MessageCircle],
          ['Analytics', null, ChartNoAxesColumn],
          ['Profile', '/profile', UserRound]
        ]
      : role === 'author'
      ? [
          ['Dashboard', '/dashboard', LayoutDashboard],
          ['My Articles', '/articles', FileText],
          ['Create Article', '/create', PlusCircle],
          ['Profile', '/profile', UserRound]
        ]
      : [
          ['Dashboard', '/dashboard', LayoutDashboard],
          ['Bookmarks', '/dashboard', Bookmark],
          ['Profile', '/profile', UserRound]
        ];

  const logout = () => {
    clearUser();
    navigate('/signin');
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Brand light />

        <div className="side-user">
          <span>
            {user.name?.[0]?.toUpperCase() || 'M'}
          </span>

          <div>
            <b>{user.name}</b>

            <small>
              {role === 'admin'
                ? 'Administrator'
                : role === 'author'
                ? 'Author'
                : 'User'}
            </small>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>

        <nav>
          {links.map(([label, path, Icon]) => (
            path ? (
              <NavLink
                key={label}
                to={path}
                end={path === '/dashboard'}
                className={({ isActive }) =>
                  isActive
                    ? 'side-link active'
                    : 'side-link'
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ) : (
              <div
                key={label}
                className="side-link disabled-link"
                title="Coming soon"
              >
                <Icon size={17} />
                {label}
                <small>Soon</small>
              </div>
            )
          ))}
        </nav>

        <button
          className="side-link logout"
          onClick={logout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-top">
          <span>
            Good day, {user.name?.split(' ')[0] || 'Writer'} ✨
          </span>

          <button
            className="avatar-button"
            onClick={() => navigate('/profile')}
          >
            {user.name?.[0]?.toUpperCase() || 'M'}
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
