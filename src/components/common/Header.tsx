import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/header.css';

const Header = () => {

  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header" style={{ backgroundColor: 'var(--imperial-blue)', padding: '1rem 0' }}>
      <div className="container header-container">

        {/* LOGO */}
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--school-bus-yellow)', fontWeight: 'bold', fontSize: '1.5rem' }}>
            ConstruRenta 🏗️
          </Link>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="nav-menu">
          <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>

            {!isAuthenticated && (
                <span style={{ color: 'white', fontWeight: 500 }}>
                    ¡Bienvenido a ConstruRenta! 👋
                </span>
            )}

            {/* Solo mostramos estos links si el usuario tiene el rol correcto */}

            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <p style={{ color: 'var(--gold)' }}>Lista De Mis Prestamos</p>
            )}

            {isAuthenticated && user?.role === 'PROVIDER' && (
              <p style={{ color: 'var(--gold)' }}>Lista De Usuarios</p>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <p style={{ color: 'var(--gold)' }}>Lista De Usuarios</p>
            )}
          </ul>
        </nav>

        {/* BOTONES DE ACCIÓN */}
        <div className="auth-buttons">
          {isAuthenticated && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleLogout}
                className="btn"
                style={{ backgroundColor: '#ef4444', color: 'white' }}
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;