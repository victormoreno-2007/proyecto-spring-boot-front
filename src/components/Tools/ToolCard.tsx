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
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }}>
      <div style={{ height: '200px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Aquí iría la imagen real */}
        <span style={{fontSize: '3rem'}}>🛠️</span> 
      </div>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ color: 'var(--imperial-blue)', marginBottom: '0.5rem' }}>{nombre}</h3>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${precio} / día</p>
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          backgroundColor: disponible ? '#d4edda' : '#f8d7da',
          color: disponible ? '#155724' : '#721c24'
        }}>
          {disponible ? 'Disponible' : 'Agotado'}
        </span>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={!disponible}>
          Alquilar
        </button>
      </div>
    </div>
  );
};

export default ToolCard;