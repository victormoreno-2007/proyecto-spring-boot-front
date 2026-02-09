import { useState } from 'react';
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
  description?: string; // Agregamos descripción para el modal
}

const ToolCard = ({ id, nombre, precio, imagen, disponible, stock, description }: ToolCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  
  // Estado para controlar la ventana flotante (Modal)
  const [showModal, setShowModal] = useState(false);

  const cartItem = id ? cart.find(item => item.id === id) : null;
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Lógica de roles
  const role = user?.role;
  // Solo el cliente (o usuario no logueado) puede ver el botón de alquilar
  const canRent = !isAuthenticated || role === 'CUSTOMER';

  const handleRent = () => {
    if (!isAuthenticated) {
        if(window.confirm("🔒 Debes iniciar sesión para alquilar. ¿Ir al Login?")) navigate("/login");
        return;
    }
    if (id) {
        addToCart({ 
            id, name: nombre, pricePerDay: precio, imageUrl: imagen, 
            description: description || '', providerId: '', status: 'AVAILABLE', stock: stock
        });
    }
  };

  return (
    <>
      {/* --- TARJETA PRINCIPAL --- */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
      }}
      >
        {/* Imagen */}
        <div style={{ height: '200px', padding: '15px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f3f4f6' }}>
          <img 
            src={imagen} 
            alt={nombre} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Sin+Imagen'; }}
          />
          {/* Burbuja de cantidad en carrito (Solo Clientes) */}
          {canRent && quantityInCart > 0 && (
             <div style={{
                 position: 'absolute', top: '10px', right: '10px',
                 background: '#22c55e', color: 'white', width: '30px', height: '30px',
                 borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
             }}>
                 {quantityInCart}
             </div>
          )}
        </div>

        {/* Info Básica */}
        <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
            {/* Título y Precio */}
            <div>
                <h3 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '5px', height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {nombre}
                </h3>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--imperial-blue)' }}>
                    ${precio.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal' }}>/día</span>
                </div>
            </div>

            {/* Botones de Acción */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                
                {/* 1. Botón VER DETALLE (Para TODOS) */}
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn"
                    style={{ 
                        width: '100%', background: 'white', border: '1px solid var(--imperial-blue)', 
                        color: 'var(--imperial-blue)', padding: '8px' 
                    }}
                >
                    👁️ Ver Detalle
                </button>

                {/* 2. Botón ALQUILAR (Solo CLIENTES y si hay stock) */}
                {canRent && (
                    <button 
                        onClick={handleRent}
                        className="btn btn-primary"
                        disabled={!disponible}
                        style={{ 
                            width: '100%', 
                            background: !disponible ? '#e5e7eb' : 'var(--imperial-blue)',
                            color: !disponible ? '#9ca3af' : 'white',
                            cursor: !disponible ? 'not-allowed' : 'pointer',
                            padding: '10px'
                        }}
                    >
                        {disponible ? (quantityInCart > 0 ? 'Agregar otro ➕' : '🛒 Alquilar') : 'Agotado'}
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* --- VENTANA FLOTANTE (MODAL) --- */}
      {showModal && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            padding: '20px',
            paddingTop: '180px',
            overflowY: 'auto'

        }} onClick={() => setShowModal(false)}>
            
            <div style={{
                background: 'white', padding: '2rem', borderRadius: '12px',
                maxWidth: '600px', width: '100%', position: 'relative',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }} onClick={e => e.stopPropagation()}>
                
                {/* Botón cerrar */}
                <button 
                    onClick={() => setShowModal(false)}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
                >
                    ✕
                </button>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Imagen Grande */}
                    <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                        <img src={imagen} alt={nombre} style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }} />
                    </div>

                    {/* Detalles */}
                    <div style={{ flex: '1 1 250px' }}>
                        <h2 style={{ color: 'var(--imperial-blue)', marginBottom: '10px' }}>{nombre}</h2>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>
                            ${precio.toLocaleString()}
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Stock Disponible:</strong> <br/>
                            <span style={{ fontSize: '1.1rem', color: stock && stock > 0 ? '#10b981' : '#dc2626' }}>
                                {stock && stock > 0 ? `${stock} unidades` : 'Sin stock'}
                            </span>
                        </div>

                        <div>
                            <strong>Descripción:</strong>
                            <p style={{ color: '#666', lineHeight: '1.6', marginTop: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                                {description || "No hay descripción disponible para esta herramienta."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pie del Modal */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <button onClick={() => setShowModal(false)} className="btn" style={{ background: '#f3f4f6', color: '#333' }}>
                        Cerrar
                    </button>
                    {/* Botón Alquilar en el Modal (Solo Clientes) */}
                    {canRent && (
                        <button onClick={() => { handleRent(); setShowModal(false); }} className="btn btn-primary" disabled={!disponible}>
                            {disponible ? '🛒 Agregar al Carrito' : 'Agotado'}
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default ToolCard;