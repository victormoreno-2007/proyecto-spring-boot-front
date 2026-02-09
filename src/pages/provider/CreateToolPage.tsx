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
                providerId: user.id,
                status: 'AVAILABLE',
                stock: newTool.stock
            };

            await toolService.createTool(toolToSave);
            alert("¡Herramienta publicada con éxito!");
            navigate('/my-inventory');

        } catch (error) {
            console.error(error);
            alert("Error al crear la herramienta");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewTool({ ...newTool, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem' }}>
            <h1 className="page-title">➕ Publicar Nueva Herramienta</h1>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* NOMBRE */}
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

                    {/* --- FILA RESPONSIVA (PRECIO, STOCK, IMAGEN) --- */}
                    {/* Usamos flex-wrap para que bajen en celular */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        
                        {/* 1. PRECIO */}
                        <div style={{ flex: '1 1 200px' }}> {/* <-- ESTO FALTABA: Base 200px, crece si hay espacio */}
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Precio (Día)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                value={newTool.pricePerDay || ''}
                                onChange={(e) => setNewTool({
                                    ...newTool,
                                    pricePerDay: e.target.value === '' ? 0 : parseFloat(e.target.value)
                                })}
                            />
                        </div>

                        {/* 2. STOCK */}
                        <div style={{ flex: '1 1 200px' }}> {/* <-- ESTO FALTABA */}
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

                        {/* 3. IMAGEN (Ocupa todo el ancho abajo en celular, o comparte en PC grande) */}
                        <div style={{ flex: '1 1 100%' }}> {/* <-- Forzamos 100% para que la imagen tenga espacio */}
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Imagen del Producto</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                style={{ marginBottom: '10px', width: '100%' }}
                                onChange={handleImageUpload}
                            />
                            {newTool.imageUrl && (
                                <div style={{ marginTop: '10px', textAlign: 'center', background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                                    <img
                                        src={newTool.imageUrl}
                                        alt="Previsualización"
                                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Descripción</label>
                        <textarea
                            rows={4}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            value={newTool.description}
                            onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', fontSize: '1.1rem', padding: '12px' }}>
                        Guardar y Publicar
                    </button>
                </form>
            </div>
        </div>
    );
};