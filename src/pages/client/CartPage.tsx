import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { bookingService } from '../../services/bookingService';
import PaymentModal from '../../components/common/PaymentModal';
import '../../styles/CartPage.css';

export default function CartPage() {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [showPayment, setShowPayment] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (selectedIds.length === 0 && cart.length > 0) {
            setSelectedIds(cart.map(item => item.id!));
        }
    }, [cart]);

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    const calculateDays = () => {
        if (!dates.startDate || !dates.endDate) return 0;
        const start = new Date(dates.startDate);
        const end = new Date(dates.endDate);
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); 
        return diffDays > 0 ? diffDays : 0;
    };

    const days = calculateDays();
    const itemsToPay = cart.filter(item => selectedIds.includes(item.id!));
    
    const total = itemsToPay.reduce((acc, item) => 
        acc + (item.pricePerDay * item.quantity), 0
    ) * (days || 1);

    const handlePaymentSuccess = async () => {
        setShowPayment(false);
        try {
            const promises = [];
            for (const item of itemsToPay) {
                for (let i = 0; i < item.quantity; i++) {
                    promises.push((async () => {
                        const booking = await bookingService.createBooking({
                            toolId: item.id!,
                            startDate: dates.startDate + "T08:00:00",
                            endDate: dates.endDate + "T18:00:00"
                        });
                        if (booking?.id) await bookingService.confirmPayment(booking.id, "CREDIT_CARD");
                    })());
                }
            }
            await Promise.all(promises);
            alert("✅ Pago exitoso.");
            if (itemsToPay.length === cart.length) clearCart();
            else itemsToPay.forEach(item => removeFromCart(item.id!));
            navigate('/my-home');
        } catch (error) {
            console.error(error);
            alert("Error procesando la reserva.");
        }
    };

    if (cart.length === 0) return (
        <div className="cart-empty-state">
            <div style={{fontSize:'4rem'}}>🛒</div>
            <h2>Tu carrito está vacío</h2>
            <button onClick={() => navigate('/my-home')} className="btn btn-primary">Ir al Catálogo</button>
        </div>
    );

    return (
        <div className="cart-page-container">
            <h1 className="title">🛒 Tu Carrito</h1>
            
            <div className="cart-layout">
                <div className="cart-items-column">
                    <div className="cart-actions-header">
                        <button 
                            className="btn-select-all"
                            onClick={() => {
                                if (selectedIds.length === cart.length) setSelectedIds([]); 
                                else setSelectedIds(cart.map(i => i.id!)); 
                            }}
                        >
                            {selectedIds.length === cart.length ? "Desmarcar Todo" : "Seleccionar Todo"}
                        </button>
                    </div>

                    {cart.map(item => (
                        <div key={item.id} className={`cart-card ${!selectedIds.includes(item.id!) ? 'unselected' : ''}`}>
                            
                            <div className="cart-card-header">
                                <input 
                                    type="checkbox"
                                    className="cart-checkbox"
                                    checked={selectedIds.includes(item.id!)}
                                    onChange={() => toggleSelect(item.id!)}
                                />
                                <img src={item.imageUrl} alt={item.name} className="cart-image" />
                                <div className="cart-info">
                                    <strong>{item.name}</strong>
                                </div>
                            </div>

                            <div className="cart-card-actions">
                                {/* Controles de Cantidad */}
                                <div className="quantity-controls" style={{visibility: selectedIds.includes(item.id!) ? 'visible' : 'hidden'}}>
                                    <button onClick={() => updateQuantity(item.id!, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => {
                                        if (item.quantity < (item.stock ?? 99)) updateQuantity(item.id!, item.quantity + 1);
                                        else alert("¡Lo sentimos, ya no hay mas unidades disponibles!");
                                    }}>+</button>
                                </div>

                                {/* Precio */}
                                <div className="price-info">
                                    <div className="total-price">${(item.pricePerDay * item.quantity).toLocaleString()}</div>
                                    <div className="unit-price">${item.pricePerDay} / día</div>
                                </div>
                                
                                {/* Botón Borrar */}
                                <button onClick={() => removeFromCart(item.id!)} className="btn-delete-item">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* COLUMNA DERECHA: RESUMEN (Sticky) */}
                <div className="cart-summary-column">
                    <div className="summary-card">
                        <h3>Resumen de Pago</h3>
                        <p className="summary-subtitle">Pagando {itemsToPay.length} producto(s)</p>

                        <div className="form-group">
                            <label>Fecha Inicio</label>
                            <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} 
                                   onChange={e => setDates({...dates, startDate: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Fecha Fin</label>
                            <input type="date" className="form-input" min={dates.startDate} 
                                   onChange={e => setDates({...dates, endDate: e.target.value})} />
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-total">
                            <span>Total ({days} días):</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                        
                        <button 
                            onClick={() => setShowPayment(true)} 
                            className="btn btn-primary btn-block" 
                            disabled={itemsToPay.length === 0 || total === 0} 
                        >
                            {itemsToPay.length === 0 ? "Selecciona productos" : "Pagar Ahora"}
                        </button>
                    </div>
                </div>
            </div>
            {showPayment && <PaymentModal total={total} onClose={() => setShowPayment(false)} onConfirmPayment={handlePaymentSuccess} />}
        </div>
    );
}