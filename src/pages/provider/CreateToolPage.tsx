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
        imageUrl: '',
        stock: 1
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
                status: 'AVAILABLE',
                stock: newTool.stock
            };

            await toolService.createTool(toolToSave);
            alert("¡Herramienta publicada con éxito!");
            navigate('/my-inventory'); // Te lleva al inventario al terminar

        } catch (error) {
            console.error(error);
            alert("Error al crear la herramienta");
        }
    };

    // Función para convertir la imagen a Base64 (Texto)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // El resultado es un string largo: "data:image/jpeg;base64,/9j/4AAQSk..."
                setNewTool({ ...newTool, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
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
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Stock Disponible</label>
                            <input
                                required
                                type="number"
                                min="1"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                value={newTool.stock}
                                onChange={(e) => setNewTool({ ...newTool, stock: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Imagen del Producto</label>

                            {/* Input para seleccionar archivo del PC */}
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                style={{ marginBottom: '10px', width: '100%' }}
                                onChange={handleImageUpload} // <--- Esta función la agregamos arriba
                            />

                            {/* Previsualización para que veas la foto que subiste */}
                            {newTool.imageUrl && (
                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <img
                                        src={newTool.imageUrl}
                                        alt="Previsualización"
                                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                            )}
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