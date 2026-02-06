import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  id?: string;
  nombre: string;
  precio: number;
  imagen: string;
  disponible: boolean;
  stock?: number;
}

const ToolCard = ({ id, nombre, precio, imagen, disponible, stock }: ToolCardProps) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart(); // Traemos 'cart' para buscar la cantidad
  const navigate = useNavigate();

  // Buscamos cuántos de este producto hay en el carrito
  const cartItem = id ? cart.find(item => item.id === id) : null;
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAction = () => {
    if (!isAuthenticated) {
        if(window.confirm("🔒 Debes iniciar sesión para alquilar. ¿Ir al Login?")) navigate("/login");
        return;
    }
    if (id) {
        // Simplemente agregamos (el contexto se encarga de sumar +1 si ya existe)
        addToCart({ 
            id, name: nombre, pricePerDay: precio, imageUrl: imagen, 
            description: '', providerId: '', status: 'AVAILABLE', stock: stock
        });
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden',
      backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', transition: 'transform 0.2s',
      position: 'relative' // Necesario para posicionar elementos absolutos
    }}>
      
      {/* IMAGEN DEL PRODUCTO */}
      <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f3f4f6', position: 'relative' }}>
        <img
          src={imagen} alt={nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Sin+Imagen'; }}
        />

        {/* 👇 AQUÍ ESTÁ LA MAGIA: LA BURBUJA VERDE TIPO RAPPI */}
        {quantityInCart > 0 && (
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#22c55e', // Verde vibrante
                color: 'white',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                border: '2px solid white',
                zIndex: 10
            }}>
                {quantityInCart}
            </div>
        )}
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '0.2rem', fontSize: '1.1rem', fontWeight: 'bold' }}>{nombre}</h3>
        
        <p style={{ fontWeight: '800', fontSize: '1.3rem', color: '#111', marginBottom: '10px' }}>
            ${precio.toLocaleString()}
            <span style={{fontSize:'0.8rem', fontWeight:'normal', color:'#666'}}> / día</span>
        </p>

        {/* Badge de Disponibilidad */}
        <div style={{ marginBottom: '15px' }}>
             <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                backgroundColor: disponible ? '#d1fae5' : '#fee2e2',
                color: disponible ? '#065f46' : '#991b1b',
             }}>
                {disponible ? '🟢 Disponible' : '🔴 Agotado'}
             </span>
        </div>

        {/* Botón de Acción */}
        <button
          className="btn"
          style={{ 
            width: '100%', marginTop: 'auto',
            backgroundColor: !disponible ? '#e5e7eb' : 'var(--imperial-blue)',
            color: !disponible ? '#9ca3af' : 'white', 
            fontWeight: 'bold', padding: '12px',
            cursor: !disponible ? 'not-allowed' : 'pointer'
          }}
          disabled={!disponible}
          onClick={handleAction}
        >
          {/* Cambiamos el texto para invitar a agregar más */}
          {!disponible ? 'No disponible' : (quantityInCart > 0 ? 'Agregar otro ➕' : 'Agregar al Carrito')}
        </button>
      </div>
    </div>
  );
};

export default ToolCard;