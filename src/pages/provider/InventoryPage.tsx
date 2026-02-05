import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toolService, type Tool } from '../../services/toolService';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export const InventoryPage = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q')?.toLowerCase() || '';

  const filteredTools = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm)
  );

  useEffect(() => {
    if (user?.id) loadMyTools();
  }, [user]);

  const loadMyTools = async () => {
    try {
      if (!user?.id) return;
      const data = await toolService.getToolsByProvider(user.id);
      setTools(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ ¿Estás seguro de eliminar esta herramienta? Esta acción no se puede deshacer.")) return;
    try {
      await toolService.deleteTool(id);
      setTools(tools.filter(t => t.id !== id));
    } catch (error) {
      alert("Error al eliminar");
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>📦 Mi Inventario</h1>
          <p>Gestiona tus {tools.length} herramientas activas.</p>
        </div>
        <Link to="/create-tool">
          <button className="btn btn-primary">➕ Nueva Herramienta</button>
        </Link>
      </div>

      {loading ? <p>Cargando inventario...</p> : (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left' }}>Producto</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Precio/Día</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Gestión</th>
              </tr>
            </thead>
            <tbody>
              {tools.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>No tienes herramientas aún.</td></tr>
              )}
              {filteredTools.map((tool) => (
                <tr key={tool.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img
                      src={tool.imageUrl || 'https://via.placeholder.com/50'}
                      alt="tool"
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{tool.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{tool.description.substring(0, 40)}...</div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--imperial-blue)' }}>
                    ${tool.pricePerDay.toLocaleString()}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                      background: tool.status === 'AVAILABLE' ? '#d1fae5' : '#fee2e2',
                      color: tool.status === 'AVAILABLE' ? '#065f46' : '#991b1b'
                    }}>
                      {tool.status === 'AVAILABLE' ? 'Disponible' : tool.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      {/* Botón Editar (Placeholder por ahora) */}
                      <button
                        onClick={() => navigate(`/edit-tool/${tool.id}`)}
                        className="btn"
                        style={{ padding: '5px 10px', background: '#e0f2fe', color: '#0369a1', marginRight: '5px' }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleDelete(tool.id!)}
                        className="btn"
                        style={{ padding: '5px 10px', background: '#fee2e2', color: '#991b1b' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};