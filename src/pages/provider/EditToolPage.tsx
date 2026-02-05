import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams sirve para leer el ID de la URL
import { toolService, type Tool } from '../../services/toolService';

export const EditToolPage = () => {
  const { id } = useParams(); // Leemos el ID de la URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<Tool>({
    name: '',
    pricePerDay: 0,
    description: '',
    imageUrl: '',
    providerId: '',
    status: 'AVAILABLE',
    stock: 1
  });

  // 1. Cargar datos al entrar
  useEffect(() => {
    if (id) {
        loadToolData(id);
    }
  }, [id]);

  const loadToolData = async (toolId: string) => {
      try {
          const tool = await toolService.getToolById(toolId);
          setFormData({ ...tool, stock: tool.stock ?? 1 })
      } catch (error) {
          alert("Error al cargar la herramienta");
          navigate('/my-inventory');
      } finally {
          setLoading(false);
      }
  };

  // 2. Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await toolService.updateTool(id, formData);
      alert("¡Herramienta actualizada!");
      navigate('/my-inventory'); 

    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  if (loading) return <div className="container" style={{padding: '2rem'}}>Cargando...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '2rem' }}>
      <h1 className="page-title">✏️ Editar Herramienta</h1>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Nombre</label>
            <input 
              required
              type="text" 
              className="form-control" 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Precio (Día)</label>
                <input 
                required
                type="number" 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                // El || '' evita el error NaN que te salía en consola
                value={formData.pricePerDay || ''} 
                onChange={(e) => setFormData({...formData, pricePerDay: parseFloat(e.target.value)})}
                />
            </div>
            <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Estado</label>
                <select 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="MAINTENANCE">En Mantenimiento</option>
                    <option value="RENTED">Alquilada</option>
                </select>
            </div>
          </div>

          <div>
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Imagen (URL)</label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>

          <div>
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Descripción</label>
            <textarea 
              rows={4} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => navigate('/my-inventory')} className="btn" style={{flex: 1, background: '#e5e7eb'}}>
                Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, fontSize: '1.1rem' }}>
                Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};