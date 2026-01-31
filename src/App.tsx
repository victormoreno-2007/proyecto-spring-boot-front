import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// TUS PÁGINAS
import { InventoryPage } from './pages/provider/InventoryPage';

// PLACEHOLDERS (Páginas vacías para que no falle la app mientras tus amigos trabajan)
const Home = () => <div className="container" style={{textAlign:'center', marginTop:'50px'}}><h1>🏠 Página de Inicio</h1><p>Bienvenido a ConstruRenta</p></div>;
const Catalogo = () => <div className="container"><h1>🛒 Catálogo Público (Para Cliente y Todos)</h1></div>;
const Login = () => <div className="container"><h1>🔐 Login</h1></div>;
const AdminDashboard = () => <div className="container"><h1>👔 Panel de Administrador</h1><p>Gestión de usuarios y reportes</p></div>;
const ClientRentals = () => <div className="container"><h1>🎒 Mis Alquileres (Cliente)</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />

          {/* 🟦 RUTAS DE ADMINISTRADOR (Compañero 1) */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* 🟩 RUTAS DE PROVEEDOR (TÚ) */}
          {/* Aquí es donde trabajarás principalmente */}
          <Route path="/provider/inventario" element={<InventoryPage />} />
          <Route path="/provider/reservas" element={<div className="container"><h1>📅 Gestión de Solicitudes</h1></div>} />

          {/* 🟨 RUTAS DE CLIENTE (Compañero 2) */}
          <Route path="/client/*" element={<ClientRentals />} />

          {/* Ruta por defecto si se pierden */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* FOOTER */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;