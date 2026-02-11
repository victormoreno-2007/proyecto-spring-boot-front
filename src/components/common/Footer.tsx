// src/components/common/Footer.tsx

// ⚠️ AJUSTA ESTA RUTA según donde creaste el archivo CSS. 
// Si está en 'src/styles/Footer.css', la ruta sería: '../../styles/Footer.css'
import { useAuth } from '../../contexts/AuthContext';
import '/home/camper/Documentos/proyecto-spring-boot-front/src/styles/footer.css'; 

import { Link, useNavigate } from 'react-router-dom';

  
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
      navigate("/");
      setTimeout(() => {
          logout();
      }, 100);
    };
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        
        {/* Sección 1: Identidad */}
        <div className="footer-column">
          <h3 className="footer-logo">ConstruRenta 🏗️</h3>
          <p>
            Soluciones integrales para contratistas y particulares. 
            Calidad y disponibilidad garantizada en todos nuestros equipos.
          </p>
        </div>

        {/* Sección 2: Navegación Rápida */}
        <div className="footer-column">
          <h4>Navegación</h4>
          <ul className="footer-links">
            <li><Link onClick={handleLogout} to="/">Inicio</Link></li>
            <li><Link to="/herramientas">Catálogo</Link></li>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </ul>
        </div>

        {/* Sección 3: Contacto */}
        <div className="footer-column">
          <h4>Contáctanos</h4>
          <p>📍 Campusland, Bucaramanga</p>
          <p>📧 Sebastian@construrenta.com</p>
          <p>📧 Victor@construrenta.com</p>
          <p>📧 Marcela@construrenta.com</p>

          <p>Hecho con amor 🥹</p>
        </div>
      </div>

      {/* Barra inferior de Copyright */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} ConstruRenta. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;