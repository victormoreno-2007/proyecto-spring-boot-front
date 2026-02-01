import { useState } from 'react';

// Interfaz TypeScript para definir qué es una herramienta
interface Tool {
  id: number;
  name: string;
  price: number;
  status: 'disponible' | 'alquilada' | 'mantenimiento';
  image: string;
}

export const InventoryPage = () => {
  // Estado para la lista de herramientas (Simulando base de datos)
  const [tools, setTools] = useState<Tool[]>([
    { id: 1, name: 'Martillo Demoledor', price: 50000, status: 'disponible', image: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Generador Eléctrico', price: 120000, status: 'alquilada', image: 'https://via.placeholder.com/50' },
  ]);

  // Estado para el formulario de crear
  const [newTool, setNewTool] = useState({ name: '', price: '', description: '' });

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">🛠️ Gestión de Inventario</h1>
      <p style={{ marginBottom: '2rem' }}>Aquí puedes agregar, editar o dar de baja tus equipos.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* COLUMNA IZQUIERDA: Formulario de Creación */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: 'var(--imperial-blue)', marginBottom: '1rem' }}>Agregar Nueva Herramienta</h3>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <label>Nombre del equipo</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej: Taladro Bosch"
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={newTool.name}
              onChange={(e) => setNewTool({...newTool, name: e.target.value})}
            />

            <label>Precio de alquiler (diario)</label>
            <input 
              type="number" 
              placeholder="0.00"
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={newTool.price}
              onChange={(e) => setNewTool({...newTool, price: e.target.value})}
            />

            <label>Descripción</label>
            <textarea 
              rows={3} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />

            <button className="btn btn-primary" style={{ marginTop: '10px' }}>
              + Publicar Herramienta
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: Tabla de herramientas existentes */}
        <div>
          <h3 style={{ color: 'var(--steel-azure)', marginBottom: '1rem' }}>Mis Herramientas ({tools.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <thead style={{ background: 'var(--imperial-blue)', color: 'white' }}>
              <tr>
                <th style={{ padding: '10px' }}>Img</th>
                <th style={{ padding: '10px' }}>Nombre</th>
                <th style={{ padding: '10px' }}>Precio/Día</th>
                <th style={{ padding: '10px' }}>Estado</th>
                <th style={{ padding: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  <td style={{ padding: '10px' }}><img src={tool.image} alt="tool" style={{ borderRadius: '4px' }} /></td>
                  <td style={{ fontWeight: 'bold' }}>{tool.name}</td>
                  <td>${tool.price.toLocaleString()}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
                      background: tool.status === 'disponible' ? '#d4edda' : '#f8d7da',
                      color: tool.status === 'disponible' ? '#155724' : '#721c24'
                    }}>
                      {tool.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button style={{ marginRight: '5px', cursor: 'pointer' }}>✏️</button>
                    <button style={{ color: 'red', cursor: 'pointer' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};