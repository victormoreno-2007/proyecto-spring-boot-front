import { useEffect, useState } from 'react';
import ToolCard from "../../components/Tools/ToolCard";
import { toolService, type Tool } from '../../services/toolService';
import { useSearchParams } from 'react-router-dom';


export default function HomePage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams(); 
    const queryEnUrl = searchParams.get('q');
    
    useEffect(() => {
        const fetchTools = async () => {
            try {
                if (queryEnUrl) {
                    // A. Si hay búsqueda en la URL, llamamos al Buscador del Backend
                    console.log("🔍 Buscando en servidor:", queryEnUrl);
                    const resultados = await toolService.searchTools(queryEnUrl);
                    setTools(resultados);
                } else {
                    // B. Si la URL está limpia, traemos todo el catálogo
                    const data = await toolService.getAllTools();
                    setTools(data);
                }
            } catch (error) {
                console.error("Error cargando el catálogo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, [queryEnUrl]);

    
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

                    {tools.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            id={tool.id}
                            nombre={tool.name}
                            precio={tool.pricePerDay}
                            imagen={tool.imageUrl || "https://placehold.co/300x200?text=Sin+Imagen"}
                            disponible={tool.status === 'AVAILABLE'}
                            stock={tool.stock}
                            description={tool.description}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}