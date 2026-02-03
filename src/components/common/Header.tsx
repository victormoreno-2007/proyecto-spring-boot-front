import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import '../../styles/header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // DETECTOR DE CLICS AFUERA
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isAuthenticated]);

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      logout();
    }, 100);
  };

  const getInspiringMessage = () => {
    if (isAuthenticated && user) {
      return `¡Manos a la obra, ${user.firstName}! 💪`;
    }
    return "Construyendo sueños, herramienta a herramienta 🏗️";
  };

  return (
    <header className="header" style={{ backgroundColor: 'var(--imperial-blue)', padding: '1rem 0' }}>
      <div className="container header-container">

        {/* LOGO */}
        <div className="logo" style={{ flexShrink: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--school-bus-yellow)', fontWeight: 'bold', fontSize: '1.5rem' }}>
            ConstruRenta 🏗️
          </Link>
        </div>

        <div className="inspiring-message" style={{ flex: 1, textAlign: 'center', padding: '0 1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: '#e2e8f0', fontStyle: 'italic', fontSize: '0.95rem' }}>
                {getInspiringMessage()}
            </span>
        </div>

        {/* NAVEGACIÓN */}
        <div className="right-section">
            
            {/* NAVEGACIÓN (Inicio) */}
            <nav className="nav-menu">
                <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                    {isAuthenticated && user?.role === 'ADMIN' ? (
                        <li><Link to="/admin/users" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Inicio</Link></li>
                    ) : isAuthenticated && user?.role === 'PROVIDER' ? (
                        <li><Link to="/my-inventory" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Inicio</Link></li>
                    ) : (
                        <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Inicio</Link></li>
                    )}
                </ul>
            </nav>

            {/* BOTONES DE SESIÓN */}
            <div className="auth-buttons">
                {!isAuthenticated ? (
                    <Link to="/login">
                        <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>Ingresar</button>
                    </Link>
                ) : (
                    <div className="user-menu-container" ref={menuRef}>
                        <div 
                            className="user-avatar" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            title={user?.firstName}
                            style={{ cursor: 'pointer' }}
                        >
                            {user?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        {isMenuOpen && (
                            <div className="dropdown-box">
                                <div className="user-name-display">{user?.firstName}</div>
                                <div style={{fontSize: '0.8rem', color: '#666', textAlign: 'center', marginBottom: '10px'}}>{user?.email}</div>
                                <button onClick={handleLogout} className="btn-logout-dropdown">Cerrar Sesión</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

      </div>
    </header>
  );
};

export default Header;