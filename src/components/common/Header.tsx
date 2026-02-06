import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext'; 
import { useState, useRef, useEffect } from 'react';
import '../../styles/header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cart, clearCart } = useCart(); 
  const navigate = useNavigate();
  const location = useLocation(); 
  const [, setSearchParams] = useSearchParams(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const searchablePaths = ['/', '/my-inventory', '/admin/users'];
    if (!searchablePaths.includes(location.pathname)) return;
    const timeoutId = setTimeout(() => {
        if (searchTerm) setSearchParams({ q: searchTerm });
        else setSearchParams({});
    }, 300); 
    return () => clearTimeout(timeoutId);
  }, [searchTerm, location.pathname, setSearchParams]);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const searchablePaths = ['/', '/my-inventory', '/admin/users'];
    if (!searchablePaths.includes(location.pathname)) {
        navigate(`/?q=${searchTerm}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const handleLogout = () => {
    clearCart(); 
    navigate("/");
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <header className="header" style={{ backgroundColor: 'var(--imperial-blue)', padding: '0.8rem 0' }}>
      <div className="container header-container">

        {/* 1. LOGO */}
        <div className="logo" style={{ flexShrink: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--school-bus-yellow)', fontWeight: 'bold', fontSize: '1.5rem' }}>
            ConstruRenta 🏗️
          </Link>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <form onSubmit={handleSearch} className="search-container">
            <input 
                type="text" className="search-input" placeholder="Buscar..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">🔍</button>
        </form>

        {/* 2. MENÚ DE NAVEGACIÓN CENTRAL (DINÁMICO SEGÚN ROL) */}
        <div className="inspiring-message" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <nav className="nav-menu">
            <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
               
              {/* MENÚ PARA ADMINISTRADOR */}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <li>
                    <Link to="/admin/users" style={{ color: '#fdc500', textDecoration: 'none', fontWeight: 'bold' }}>
                      👥 Usuarios
                    </Link>
                </li>
              )}

              {/* MENÚ PARA PROVEEDOR */}
              {isAuthenticated && user?.role === 'PROVIDER' && (
                <>
                  <li>
                    <Link to="/my-inventory" className="nav-item" style={{ color: 'white' }}>
                      📦 Mi Inventario
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-rentals" className="nav-item" style={{ color: 'white', fontWeight: 500 }}>
                      🤝 Mis Rentas
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

        <div className="right-section">
            {isAuthenticated && user?.role === 'CUSTOMER' && (
             <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', marginRight: '15px' }}>
                <span style={{ fontSize: '1.8rem' }}>🛒</span>
                {totalItems > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-10px',
                        backgroundColor: '#ef4444', // Rojo
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        border: '2px solid var(--imperial-blue)'
                    }}>
                        {totalItems}
                    </span>
                )}
             </Link>
          )}

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
                >
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>

                {isMenuOpen && (
                  <div className="dropdown-box">
                    <div className="user-name-display">{user?.firstName} {user?.lastName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center', marginBottom: '10px' }}>{user?.email}</div>
                    
                    {/* Enlaces rápidos del Dropdown */}
                    {user?.role === 'CUSTOMER' && (
                        <Link to="/my-home" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>📅 Mis Reservas</Link>
                    )}
                    {user?.role === 'PROVIDER' && (
                        <Link to="/my-inventory" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>📦 Mi Inventario</Link>
                    )}
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}><span>✏️</span> Editar Perfil</Link>
                    <div className="dropdown-divider"></div>
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