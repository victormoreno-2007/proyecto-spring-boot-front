

interface ToolCardProps {
  nombre: string;
  precio: number;
  imagen: string;
  disponible: boolean;
}

const ToolCard = ({ nombre, precio, imagen, disponible }: ToolCardProps) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. SECCIÓN DE IMAGEN */}
      <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
        <img
          src={imagen}
          alt={nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          // 👇 CORRECCIÓN: Usamos placehold.co que es más rápido y seguro
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Sin+Imagen';
          }}
        />
      </div>

      {/* 2. SECCIÓN DE INFORMACIÓN */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          color: 'var(--imperial-blue)',
          marginBottom: '0.5rem',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          {nombre}
        </h3>

        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333', marginBottom: '10px' }}>
          ${precio.toLocaleString()} / día
        </p>

        <div style={{ marginBottom: '15px' }}>
          <span style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            backgroundColor: disponible ? '#d1fae5' : '#fee2e2',
            color: disponible ? '#065f46' : '#991b1b',
            display: 'inline-block'
          }}>
            {disponible ? '🟢 Disponible' : '🔴 No disponible'}
          </span>
        </div>

        {/* El botón se empuja al final automáticamente */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 'auto' }}
          disabled={!disponible}
        >
          {disponible ? 'Alquilar Ahora' : 'Agotado'}
        </button>
      </div>
    </div>
  );
};

export default ToolCard;