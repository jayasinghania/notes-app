import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-title">
          NotesApp
        </Link>
        <div>
          {user && (
            <div className="nav-user-info">
              <span>{user.name}</span>
              <button onClick={logout} className="btn btn-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;