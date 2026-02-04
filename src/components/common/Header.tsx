import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import '../../styles/header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // DETECTOR DE CLICS AFUERA (Para cerrar el menú de usuario)
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

  return (
    <header className="header" style={{ backgroundColor: 'var(--imperial-blue)', padding: '1rem 0' }}>
      <div className="container header-container">

        {/* 1. LOGO */}
        <div className="logo" style={{ flexShrink: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--school-bus-yellow)', fontWeight: 'bold', fontSize: '1.5rem' }}>
            ConstruRenta 🏗️
          </Link>
        </div>

        {/* 2. MENÚ DE NAVEGACIÓN CENTRAL (DINÁMICO SEGÚN ROL) */}
        <div className="inspiring-message" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>

          {/* Usamos clases del CSS en lugar de estilos inline para mejor hover */}
          <nav className="nav-menu">
            <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
               

              {/* MENÚ PARA ADMINISTRADOR */}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/users" style={{ color: '#fdc500', textDecoration: 'none', fontWeight: 'bold' }}>
                      👥 Usuarios
                    </Link>
                  </li>
                  {/* Aquí podrías agregar más opciones de Admin en el futuro */}
                </>
              )}

              {/* MENÚ PARA PROVEEDOR */}
              {isAuthenticated && user?.role === 'PROVIDER' && (
                <>
                 <li>
                  <Link to="/" className="nav-item" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>
                  Inicio
                  </Link>
                </li>
                  <li>
                    <Link to="/my-inventory" className="nav-item" style={{ color: 'white' }}>
                      📦 Mi Inventario
                    </Link>
                  </li>
                  <li>
                    <Link to="/create-tool" className="nav-item" style={{ color: '#fdc500', fontWeight: 'bold' }}>
                      ➕ Publicar Herramienta
                    </Link>
                  </li>
                </>
              )}

              {/* MENÚ PARA CLIENTE */}
              {isAuthenticated && user?.role === 'CUSTOMER' && (
                <>
                 <li>
                  <Link to="/" className="nav-item" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>
                  Inicio
                  </Link>
                </li>
                  <li>
                    <Link to="/my-home" style={{ color: '#fdc500', textDecoration: 'none', fontWeight: 'bold' }}>
                      📅 Mis Reservas
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </nav>
        </div>

        {/* 3. ZONA DERECHA: BOTONES DE SESIÓN */}
        <div className="right-section">
          <div className="auth-buttons">
            {!isAuthenticated ? (
              <Link to="/login">
                <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>Ingresar</button>
              </Link>
            ) : (
              <div className="user-menu-container" ref={menuRef}>

                {/* Mensaje de bienvenida corto */}
                <span style={{ color: 'white', marginRight: '10px', fontSize: '0.9rem', display: 'block' }}>
                 Bienvenido, {user?.firstName}
                </span>

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
                    <div className="user-name-display">{user?.firstName} {user?.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginBottom: '5px' }}>
                      Rol: <strong>{user?.role}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center', marginBottom: '10px' }}>{user?.email}</div>
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