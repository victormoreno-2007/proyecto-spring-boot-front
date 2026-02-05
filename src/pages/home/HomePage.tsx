import { useEffect, useState } from 'react';
import ToolCard from "../../components/Tools/ToolCard";
import { toolService, type Tool } from '../../services/toolService';
import { useSearchParams } from 'react-router-dom';

export default function HomePage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get('q')?.toLowerCase() || '';
    
    const filteredTools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) || 
        tool.description.toLowerCase().includes(searchTerm)
    );

    useEffect(() => {
        loadCatalog();
    }, []);

    const loadCatalog = async () => {
        try {
            // Llama al método que agregamos al servicio
            const data = await toolService.getAllTools();
            setTools(data);
        } catch (error) {
            console.error("Error cargando el catálogo:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="page-title">Bienvenido a ConstruRenta 🏗️</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                    El mejor catálogo de herramientas para tus proyectos.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: 'var(--imperial-blue)' }}>
                    Cargando herramientas...
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {tools.length === 0 && (
                        <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', fontSize: '1.1rem' }}>
                            No hay herramientas publicadas en este momento.
                        </p>
                    )}

                    {filteredTools.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            nombre={tool.name}
                            precio={tool.pricePerDay}
                            imagen={tool.imageUrl || "https://placehold.co/300x200?text=Sin+Imagen"}
                            disponible={tool.status === 'AVAILABLE'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}