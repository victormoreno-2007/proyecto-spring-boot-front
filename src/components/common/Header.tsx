import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext'; // <--- 1. Importar Contexto
import { useState, useRef, useEffect } from 'react';
import '../../styles/header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cart } = useCart(); // <--- 2. Usar el carrito
  const navigate = useNavigate();
  const location = useLocation(); 
  const [, setSearchParams] = useSearchParams(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Calcular total de artículos (suma de cantidades)
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
    navigate("/");
    setTimeout(() => logout(), 100);
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

        {/* 3. ZONA DERECHA */}
        <div className="right-section">
          
          {/* 👇 BOTÓN DEL CARRITO CON CONTADOR */}
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
                    
                    {/* Enlaces según rol */}
                    {user?.role === 'CUSTOMER' && (
                        <Link to="/my-home" className="dropdown-item">📅 Mis Reservas</Link>
                    )}
                    {user?.role === 'PROVIDER' && (
                        <Link to="/my-inventory" className="dropdown-item">📦 Mi Inventario</Link>
                    )}
                    {user?.role === 'ADMIN' && (
                         <Link to="/admin/users" className="dropdown-item">👥 Usuarios</Link>
                    )}

                    <Link to="/profile" className="dropdown-item"><span>✏️</span> Editar Perfil</Link>
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