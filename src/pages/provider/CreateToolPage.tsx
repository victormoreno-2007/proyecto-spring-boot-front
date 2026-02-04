import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toolService, type Tool } from '../../services/toolService';
import { useNavigate } from 'react-router-dom';


export const CreateToolPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [newTool, setNewTool] = useState({
        name: '',
        pricePerDay: 0,
        description: '',
        imageUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return alert("Error: No identificado");

        try {
            const toolToSave: Tool = {
                name: newTool.name,
                description: newTool.description,
                pricePerDay: Number(newTool.pricePerDay),
                imageUrl: newTool.imageUrl || "https://placehold.co/300x200?text=Sin+Imagen",
                providerId: user.id, // Tu ID de Backend
                status: 'AVAILABLE'
            };

            await toolService.createTool(toolToSave);
            alert("¡Herramienta publicada con éxito!");
            navigate('/my-inventory'); // Te lleva al inventario al terminar

        } catch (error) {
            console.error(error);
            alert("Error al crear la herramienta");
        }
    };

    return (

        <div className="container" style={{ maxWidth: '600px', padding: '2rem' }}>
            <h1 className="page-title">➕ Publicar Nueva Herramienta</h1>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nombre del equipo</label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            placeholder="Ej: Taladro Percutor Industrial"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            value={newTool.name}
                            onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Precio (Día)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}

                                // 👇 CORRECCIÓN AQUÍ: Si es 0 o NaN, pon comillas vacías ''
                                value={newTool.pricePerDay || ''}

                                onChange={(e) => setNewTool({
                                    ...newTool,
                                    // Si el valor es vacío, guardamos 0, si no, lo convertimos a float
                                    pricePerDay: e.target.value === '' ? 0 : parseFloat(e.target.value)
                                })}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Imagen (URL)</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                value={newTool.imageUrl}
                                onChange={(e) => setNewTool({ ...newTool, imageUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Descripción</label>
                        <textarea
                            rows={4}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            value={newTool.description}
                            onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', fontSize: '1.1rem' }}>
                        Guardar y Publicar
                    </button>
                </form>
            </div>
        </div>
    );
};