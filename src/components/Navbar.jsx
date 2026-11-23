
import { Link, useNavigate } from 'react-router-dom';
import { CircleUserRound, LogOut } from 'lucide-react';
import Brand from './Brand';
import { getUser, clearUser } from '../data';

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <header className="site-nav">
      <Brand />

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="/#discover">Discover</a>
        <a href="/#about">About</a>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <button
              className="icon-button"
              onClick={() => navigate('/dashboard')}
              aria-label="Dashboard"
              title="Dashboard"
            >
              <CircleUserRound size={20} />
            </button>

            <button
              className="btn-soft"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn-soft" to="/signin">
              Sign In
            </Link>

            <Link className="btn-primary" to="/register">
              Join MuseNest
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
