import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">

      {/* ── Row 1: Brand + Login/Logout ── */}
      <div className="flex items-center justify-between px-5 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-400">
          🚗 SmartPark
        </Link>

        {/* Desktop: full nav in one row */}
        <div className="hidden sm:flex items-center gap-5">
          {user ? (
            <>
              <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">Parking</Link>
              <Link to="/bookings" className="text-sm text-slate-400 hover:text-white transition-colors">My Bookings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">Admin</Link>
              )}
              <span className="text-xs text-slate-200 bg-slate-700 px-2 py-1 rounded">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md cursor-pointer transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors">Register</Link>
            </>
          )}
        </div>

        {/* Mobile: only login/logout on row 1 */}
        <div className="flex sm:hidden items-center gap-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md cursor-pointer transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* ── Row 2 (mobile only): Nav links + username ── */}
      {user && (
        <div className="flex sm:hidden items-center gap-4 px-5 py-2 border-t border-slate-700 bg-slate-800/80">
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">Parking</Link>
          <Link to="/bookings" className="text-sm text-slate-400 hover:text-white transition-colors">My Bookings</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">Admin</Link>
          )}
          <span className="ml-auto text-xs text-slate-200 bg-slate-700 px-2 py-1 rounded truncate max-w-[100px]">
            {user.name}
          </span>
        </div>
      )}

    </nav>
  );
}
