import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  id?: string; // IMPORTANTE: El ID es obligatorio para el carrito
  nombre: string;
  precio: number;
  imagen: string;
  disponible: boolean;
  stock?: number;
}

const ToolCard = ({ id, nombre, precio, imagen, disponible, stock }: ToolCardProps) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  // Verificamos si ya está en el carrito (solo si hay ID)
  const isAdded = id ? isInCart(id) : false;

  const handleAction = () => {
    if (!isAuthenticated) {
        if(window.confirm("🔒 Debes iniciar sesión para alquilar. ¿Ir al Login?")) {
            navigate("/login");
        }
        return;
    }

    if (id) {
        if (isAdded) {
            navigate("/cart"); // Si ya está, ir al carrito
        } else {
            addToCart({ 
                id, name: nombre, pricePerDay: precio, imageUrl: imagen, 
                description: '', providerId: '', status: 'AVAILABLE',
                stock: stock
            });
        }
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden',
      backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
        <img
          src={imagen} alt={nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Sin+Imagen'; }}
        />
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: 'var(--imperial-blue)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>{nombre}</h3>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333', marginBottom: '10px' }}>${precio.toLocaleString()} / día</p>

        <div style={{ marginBottom: '15px' }}>
             <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                backgroundColor: disponible ? '#d1fae5' : '#fee2e2',
                color: disponible ? '#065f46' : '#991b1b',
             }}>
                {disponible ? '🟢 Disponible' : '🔴 No disponible'}
             </span>
        </div>

        <button
          className="btn"
          style={{ 
            width: '100%', marginTop: 'auto',
            backgroundColor: !disponible ? '#ccc' : (isAdded ? '#10b981' : 'var(--imperial-blue)'),
            color: 'white', fontWeight: 'bold', padding: '10px'
          }}
          disabled={!disponible}
          onClick={handleAction}
        >
          {!disponible ? 'Agotado' : (isAdded ? '✅ Ver en Carrito' : '🛒 Añadir al Carrito')}
        </button>
      </div>
    </div>
  );
};

export default ToolCard;