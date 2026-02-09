import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService, type Booking } from '../../services/bookingService';
import '../../styles/MyBookingPage.css'; // Reusamos el CSS de tarjetas que ya creamos

export default function RentalManagementPage() {
    const { user } = useAuth();
    const [rentals, setRentals] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado para el Modal de Devolución
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [withDamage, setWithDamage] = useState(false);
    const [damageDesc, setDamageDesc] = useState('');
    const [repairCost, setRepairCost] = useState(0);

    useEffect(() => {
        if (user?.id) loadRentals();
    }, [user]);

    const loadRentals = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const data = await bookingService.getProviderBookings(user.id);
            // Ordenar: Pendientes y Confirmadas primero
            setRentals(data.sort((a) => (a.status === 'COMPLETED' ? 1 : -1)));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturnSubmit = async () => {
        if (!selectedBooking) return;
        
        if (withDamage && (!damageDesc || repairCost <= 0)) {
            alert("⚠️ Por favor describe el daño e indica el costo de reparación.");
            return;
        }

        if (!confirm("¿Confirmar recepción de la herramienta? Esto finalizará la reserva.")) return;

        try {
            await bookingService.registerReturn(selectedBooking.id, {
                withDamage,
                damageDescription: damageDesc,
                repairCost
            });
            alert("✅ Devolución registrada con éxito.");
            setSelectedBooking(null);
            resetForm();
            loadRentals();
        } catch (error) {
            console.error(error);
            alert("❌ Error al registrar la devolución.");
        }
    };

    const resetForm = () => {
        setWithDamage(false);
        setDamageDesc('');
        setRepairCost(0);
    };

    if (loading) return <div style={{textAlign:'center', padding:'3rem'}}><h3>Cargando rentas...</h3></div>;

    return (
        <div className="bookings-container">
            <h1 className="page-title">🤝 Gestión de Alquileres</h1>
            <p style={{marginBottom:'2rem', color:'#666'}}>
                Administra las herramientas que tienes alquiladas y registra su devolución.
            </p>

            <div className="bookings-grid">
                {rentals.length === 0 ? <p>No tienes alquileres activos.</p> : rentals.map(rental => (
                    <div key={rental.id} className={`booking-card status-${rental.status.toLowerCase()}`}>
                        
                        {/* Info de la Herramienta */}
                        <div className="tool-info">
                            {/* Usamos rental.tool si el backend lo envía poblado, sino un placeholder */}
                            <img 
                                src={rental.tool?.imageUrl || "https://placehold.co/100?text=Tool"} 
                                className="tool-image" alt="Herramienta"
                            />
                            <div className="tool-details">
                                <h3>{rental.tool?.name || "Herramienta"}</h3>
                                <div className="booking-id">Cliente: {rental.userId}</div>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="booking-meta">
                            <div className="meta-item">
                                <span className="meta-label">Desde</span>
                                <span className="meta-value">{rental.startDate.split('T')[0]}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Hasta</span>
                                <span className="meta-value">{rental.endDate.split('T')[0]}</span>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="booking-actions">
                            <span className="status-badge">{rental.status}</span>
                            
                            {/* Solo mostramos el botón si la reserva está activa (CONFIRMED) */}
                            {rental.status === 'PENDING' && (
                                <div style={{display:'flex', gap:'8px', marginTop:'5px'}}>
                                    <button 
                                        className="btn"
                                        style={{padding:'6px 12px', fontSize:'0.85rem', background:'#10b981', color:'white'}} // Verde
                                        onClick={async () => {
                                            if(!confirm("¿Aprobar esta reserva?")) return;
                                            try {
                                                await bookingService.approveBooking(rental.id);
                                                alert("✅ Reserva Aprobada");
                                                loadRentals(); // Recargar lista
                                            } catch (e) { alert("Error al aprobar"); }
                                        }}
                                    >
                                        ✅ Aprobar
                                    </button>

                                    <button 
                                        className="btn"
                                        style={{padding:'6px 12px', fontSize:'0.85rem', background:'#ef4444', color:'white'}} // Rojo
                                        onClick={async () => {
                                            if(!confirm("¿Rechazar esta reserva? Se cancelará.")) return;
                                            try {
                                                await bookingService.rejectBooking(rental.id);
                                                alert("🚫 Reserva Rechazada");
                                                loadRentals(); // Recargar lista
                                            } catch (e) { alert("Error al rechazar"); }
                                        }}
                                    >
                                        🚫 Rechazar
                                    </button>
                                </div>
                            )}
                            {/* CASO 2: RESERVA CONFIRMADA (Recibir Herramienta) */}
                            {rental.status === 'CONFIRMED' && (
                                <button 
                                    className="btn btn-primary"
                                    style={{fontSize:'0.9rem', padding:'8px 16px', marginTop:'5px'}}
                                    onClick={() => setSelectedBooking(rental)}
                                >
                                    📥 Recibir Herramienta
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE DEVOLUCIÓN */}
            {selectedBooking && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxWidth:'500px'}}>
                        <h2>Registrar Devolución</h2>
                        <p>Herramienta: <strong>{selectedBooking.tool?.name}</strong></p>
                        
                        <div style={{margin:'20px 0', padding:'15px', background:'#f9fafb', borderRadius:'8px'}}>
                            <label style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'1.1rem', cursor:'pointer'}}>
                                <input 
                                    type="checkbox" 
                                    checked={withDamage} 
                                    onChange={e => setWithDamage(e.target.checked)}
                                    style={{transform:'scale(1.2)'}}
                                />
                                ¿Tiene daños o averías?
                            </label>

                            {withDamage && (
                                <div style={{marginTop:'15px', animation:'fadeIn 0.3s'}}>
                                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Descripción del daño:</label>
                                    <textarea 
                                        className="form-input"
                                        value={damageDesc}
                                        onChange={e => setDamageDesc(e.target.value)}
                                        placeholder="Ej: Pantalla rota, cable cortado..."
                                    />
                                    
                                    <label style={{display:'block', marginBottom:'5px', marginTop:'10px', fontWeight:'bold'}}>Costo de reparación ($):</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        value={repairCost}
                                        onChange={e => setRepairCost(Number(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                            <button onClick={() => {setSelectedBooking(null); resetForm();}} className="btn" style={{background:'#ccc', color:'#333'}}>Cancelar</button>
                            <button onClick={handleReturnSubmit} className="btn btn-primary">Confirmar Recepción</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}