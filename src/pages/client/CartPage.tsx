import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { bookingService } from '../../services/bookingService';
import PaymentModal from '../../components/common/PaymentModal';
import '../../pages/user/UsersPage.css'; 

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [showPayment, setShowPayment] = useState(false);

    const calculateDays = () => {
        if (!dates.startDate || !dates.endDate) return 0;
        const start = new Date(dates.startDate);
        const end = new Date(dates.endDate);
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); 
        return diffDays > 0 ? diffDays : 0;
    };

    const days = calculateDays();
    const total = cart.reduce((acc, item) => acc + item.pricePerDay, 0) * (days || 1);

    const handlePaymentSuccess = async () => {
        setShowPayment(false);
        try {
            const promises = cart.map(async (item) => {
                const booking = await bookingService.createBooking({
                    toolId: item.id!,
                    startDate: dates.startDate + "T08:00:00",
                    endDate: dates.endDate + "T18:00:00"
                });
                if (booking?.id) await bookingService.confirmPayment(booking.id, "CREDIT_CARD");
            });
            await Promise.all(promises);
            alert("✅ Pago exitoso. Redirigiendo a tus reservas.");
            clearCart();
            navigate('/my-home');
        } catch (error) {
            console.error(error);
            alert("Error procesando la reserva.");
        }
    };

    if (cart.length === 0) return <div className="container" style={{padding:'4rem', textAlign:'center'}}><h2>Tu carrito está vacío 🛒</h2></div>;

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 className="title">🛒 Tu Carrito</h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 2 }}>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee' }}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <img src={item.imageUrl} style={{width:'50px', height:'50px', objectFit:'cover'}} />
                                <strong>{item.name}</strong>
                            </div>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <span>${item.pricePerDay}</span>
                                <button onClick={() => removeFromCart(item.id!)} className="btn-delete">X</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3>Resumen</h3>
                    <div className="form-group">
                        <label>Fecha Inicio:</label>
                        <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} 
                               onChange={e => setDates({...dates, startDate: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Fecha Fin:</label>
                        <input type="date" className="form-input" min={dates.startDate} 
                               onChange={e => setDates({...dates, endDate: e.target.value})} />
                    </div>
                    <hr />
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:'bold'}}>
                        <span>Total:</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                    <button onClick={() => setShowPayment(true)} className="btn btn-primary" style={{width:'100%', marginTop:'1rem'}}>
                        Pagar Ahora
                    </button>
                </div>
            </div>
            {showPayment && <PaymentModal total={total} onClose={() => setShowPayment(false)} onConfirmPayment={handlePaymentSuccess} />}
        </div>
    );
}