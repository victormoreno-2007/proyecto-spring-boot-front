import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../styles/header.css';

export const Header = () => {
  // ESTADO TEMPORAL PARA SIMULAR ROLES (Borrar esto cuando integren el Login real)
  const [role, setRole] = useState<'guest' | 'admin' | 'provider' | 'client'>('guest');

  return (
    <header style={{ backgroundColor: 'var(--imperial-blue)', padding: '1rem 0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div className="container header-container">
        
        {/* LOGO */}
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--school-bus-yellow)' }}>
          ConstruRenta 🏗️
        </Link>

        {/* NAVEGACIÓN DINÁMICA SEGÚN EL ROL */}
        <nav className="nav-links">
          <Link to="/" className="nav-item">Inicio</Link>
          <Link to="/catalogo" className="nav-item">Catálogo</Link>

          {/* MENÚ SOLO PARA ADMIN (Tu compañero) */}
          {role === 'admin' && (
            <>
              <Link to="/admin/usuarios" className="nav-item" style={{ color: 'var(--gold)' }}>👥 Usuarios</Link>
              <Link to="/admin/reportes" className="nav-item" style={{ color: 'var(--gold)' }}>📊 Reportes</Link>
            </>
          )}

          {/* MENÚ SOLO PARA PROVEEDOR (Tú) */}
          {role === 'provider' && (
            <>
              <Link to="/provider/inventario" className="nav-item" style={{ color: '#00ffcc' }}>🛠️ Mi Inventario</Link>
              <Link to="/provider/reservas" className="nav-item" style={{ color: '#00ffcc' }}>📅 Solicitudes</Link>
            </>
          )}

          {/* MENÚ SOLO PARA CLIENTE (Tu compañero) */}
          {role === 'client' && (
             <Link to="/client/mis-alquileres" className="nav-item">🎒 Mis Alquileres</Link>
          )}
        </nav>

        {/* SIMULADOR DE ROLES (Botones temporales para desarrollo) */}
        <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '5px' }}>
          <span style={{ color: 'white', marginRight: '5px' }}>Simular:</span>
          <button onClick={() => setRole('admin')}>Admin</button> | 
          <button onClick={() => setRole('provider')}>Prov</button> | 
          <button onClick={() => setRole('client')}>Client</button>
        </div>

        {/* BOTONES DE AUTH */}
        <div className="auth-buttons">
          {role === 'guest' ? (
            <Link to="/login">
              <button className="btn btn-secondary" style={{ padding: '8px 15px' }}>Ingresar</button>
            </Link>
          ) : (
            <button onClick={() => setRole('guest')} className="btn btn-primary" style={{ border: '1px solid white' }}>
              Salir ({role})
            </button>
          )}
        </div>

      </div>
    </header>
  );
};