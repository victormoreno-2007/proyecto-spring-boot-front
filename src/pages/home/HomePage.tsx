 // Verifica que la carpeta sea 'tools' o 'Tools'

import ToolCard from "../../components/Tools/ToolCard";

export default function HomePage() {
    return (
        <div className="container" style={{ padding: '2rem 0', textAlign: 'center'}}>
            <h1 className="page-title">Bienvenido a ConstruRenta 🏗️</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                El mejor catálogo de herramientas para tus proyectos.
            </p>

            {/* Aquí luego pondremos las herramientas reales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                <p>aquí va las herramientas</p>
            </div>
        </div>
    );
}