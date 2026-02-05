import { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../services/bookingService';
import { toolService } from '../services/toolService';


export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [desc, setDesc] = useState('');

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await bookingService.getMyBookings();
            // Truco: Buscamos la info de la herramienta por cada reserva
            const fullData = await Promise.all(data.map(async (b) => {
                try {
                    const tool = await toolService.getToolById(b.toolId);
                    return { ...b, tool };
                } catch { return b; }
            }));
            setBookings(fullData);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleReport = async () => {
        if (!selectedId || !desc) return;
        if (!confirm("¿Confirmas que llegó dañado? Se cancelará la reserva.")) return;
        try {
            await bookingService.reportArrivalIssue(selectedId, desc);
            alert("Reporte enviado. Reembolso procesado.");
            setIsModalOpen(false);
            load(); 
        } catch { alert("Error al reportar"); }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 className="page-title">📅 Mis Reservas</h1>
            {loading ? <p>Cargando...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map(b => (
                        <div key={b.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3>{b.tool?.name || 'Herramienta'}</h3>
                                <p>Estado: <strong>{b.status}</strong></p>
                            </div>
                            {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                                <button 
                                    onClick={() => { setSelectedId(b.id); setIsModalOpen(true); }}
                                    className="btn"
                                    style={{ background: '#fee2e2', color: '#991b1b' }}
                                >
                                    🚨 Reportar Daño
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Reportar Problema</h2>
                        <textarea placeholder="Describe el daño..." style={{ width: '100%', padding: '10px', margin: '10px 0' }} value={desc} onChange={e => setDesc(e.target.value)} />
                        <button onClick={handleReport} className="btn" style={{ background: '#dc2626', color: 'white' }}>Confirmar</button>
                        <button onClick={() => setIsModalOpen(false)} className="btn-cancel" style={{ marginLeft: '10px' }}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}