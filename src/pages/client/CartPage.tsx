import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { bookingService } from '../../services/bookingService';
import PaymentModal from '../../components/common/PaymentModal';
import '../../styles/CartPage.css';

export default function CartPage() {
    const { cart, removeFromCart, clearCart, updateQuantity, updateDates } = useCart();
    const navigate = useNavigate();
    const [showPayment, setShowPayment] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        // Seleccionar todos por defecto al entrar
        if (selectedIds.length === 0 && cart.length > 0) {
            setSelectedIds(cart.map(item => item.id!));
        }
    }, [cart.length]);

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    // Calcular días de un ítem específico
    const calculateItemDays = (start?: string, end?: string) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (startDate > endDate) return 0;
        
        const diffDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)); 
        return diffDays > 0 ? diffDays : 1; 
    };

    const itemsToPay = cart.filter(item => selectedIds.includes(item.id!));
    
    const granTotal = itemsToPay.reduce((acc, item) => {
        const days = calculateItemDays(item.startDate, item.endDate);
        if (!item.startDate || !item.endDate) return acc;
        return acc + (item.pricePerDay * item.quantity * days);
    }, 0);

    const isReadyToPay = itemsToPay.length > 0 && itemsToPay.every(item => item.startDate && item.endDate);

    const handlePaymentSuccess = async () => {
        setShowPayment(false);
        try {
            const promises = [];
            
            for (const item of itemsToPay) {
                if (!item.startDate || !item.endDate) continue;
                for (let i = 0; i < item.quantity; i++) {
                    promises.push((async () => {
                        const booking = await bookingService.createBooking({
                            toolId: item.id!,
                            startDate: item.startDate + "T08:00:00", 
                            endDate: item.endDate + "T18:00:00"
                        });
                        if (booking?.id) await bookingService.confirmPayment(booking.id, "CREDIT_CARD");
                    })());
                }
            }

            await Promise.all(promises);
            alert("✅ ¡Pago Exitoso! Generando facturas en tu historial...");
            
            if (itemsToPay.length === cart.length) clearCart();
            else itemsToPay.forEach(item => removeFromCart(item.id!));
            
            navigate('/my-home');
        } catch (error) {
            console.error(error);
            alert("⚠️ Error procesando el pago. Verifica disponibilidad.");
        }
    };

    if (cart.length === 0) return (
        <div className="cart-empty-state">
            <div style={{fontSize:'4rem'}}>🛒</div>
            <h2>Tu carrito está vacío</h2>
            <button onClick={() => navigate('/')} className="btn btn-primary">Ir al Catálogo</button>
        </div>
    );

    return (
        <div className="cart-page-container">
            <h1 className="title">🛒 Tu Carrito</h1>
            
            <div className="cart-layout">
                {/* COLUMNA IZQUIERDA: Ítems */}
                <div className="cart-items-column">
                    <div className="cart-actions-header">
                        <button className="btn-select-all" onClick={() => {
                                if (selectedIds.length === cart.length) setSelectedIds([]); 
                                else setSelectedIds(cart.map(i => i.id!)); 
                        }}>
                            {selectedIds.length === cart.length ? "Desmarcar Todo" : "Seleccionar Todo"}
                        </button>
                    </div>

                    {cart.map(item => {
                        const isSelected = selectedIds.includes(item.id!);
                        const days = calculateItemDays(item.startDate, item.endDate);
                        const subtotal = item.pricePerDay * item.quantity * (days || 0);

                        return (
                            <div key={item.id} className={`cart-card ${!isSelected ? 'unselected' : ''}`} style={{flexDirection: 'column', alignItems: 'stretch'}}>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                                    <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id!)} style={{width:'20px', height:'20px'}} />
                                        <img src={item.imageUrl} alt={item.name} className="cart-image" />
                                        <div>
                                            <div style={{fontWeight:'bold', fontSize:'1.1rem'}}>{item.name}</div>
                                            <div className="unit-price">${item.pricePerDay.toLocaleString()} / día</div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id!)} className="btn-delete-item">🗑️</button>
                                </div>
                                <div style={{display:'flex', gap:'20px', flexWrap:'wrap', alignItems:'end', background:'#f8f9fa', padding:'15px', borderRadius:'8px'}}>
                                    <div style={{flex: 1, minWidth: '200px'}}>
                                        <label style={{fontSize:'0.8rem', fontWeight:'bold', display:'block', marginBottom:'5px'}}>📅 Fechas de Alquiler</label>
                                        <div style={{display:'flex', gap:'10px'}}>
                                            <input type="date" className="form-input" style={{margin:0, fontSize:'0.9rem'}} min={new Date().toISOString().split('T')[0]} value={item.startDate || ''} onChange={(e) => updateDates(item.id!, e.target.value, item.endDate || '')} />
                                            <span style={{alignSelf:'center'}}>➜</span>
                                            <input type="date" className="form-input" style={{margin:0, fontSize:'0.9rem'}} min={item.startDate || new Date().toISOString().split('T')[0]} value={item.endDate || ''} onChange={(e) => updateDates(item.id!, item.startDate || '', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{fontSize:'0.8rem', fontWeight:'bold', display:'block', marginBottom:'5px'}}>Cantidad</label>
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id!, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => { if (item.quantity < (item.stock ?? 99)) updateQuantity(item.id!, item.quantity + 1); else alert("¡Límite de stock alcanzado!"); }}>+</button>
                                        </div>
                                    </div>
                                    <div style={{textAlign:'right', minWidth:'100px'}}>
                                        <label style={{fontSize:'0.8rem', color:'#666', display:'block'}}>Subtotal ({days} días)</label>
                                        <div style={{fontSize:'1.2rem', fontWeight:'bold', color:'var(--imperial-blue)'}}>${subtotal.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* COLUMNA DERECHA: Resumen */}
                <div className="cart-summary-column">
                    <div className="summary-card">
                        <h3>Resumen Total</h3>
                        <p className="summary-subtitle">{itemsToPay.length} producto(s) seleccionados</p>
                        <div className="summary-divider"></div>
                        {!isReadyToPay && itemsToPay.length > 0 && (
                            <div style={{color:'#991b1b', background:'#fee2e2', padding:'10px', borderRadius:'6px', fontSize:'0.9rem', marginBottom:'15px'}}>
                                ⚠️ Selecciona fecha de inicio y fin para todas las herramientas.
                            </div>
                        )}
                        <div className="summary-total">
                            <span>Total a Pagar:</span>
                            <span>${granTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={() => setShowPayment(true)} className="btn btn-primary btn-block" disabled={!isReadyToPay} style={{opacity: !isReadyToPay ? 0.6 : 1}}>
                            Pagar Ahora
                        </button>
                    </div>
                </div>
            </div>
            
            {/* 👇 AQUÍ ESTÁ LA CORRECCIÓN: Pasamos 'items' al modal */}
            {showPayment && (
                <PaymentModal 
                    items={itemsToPay} // <--- ESTA LÍNEA ES LA CLAVE PARA LA PREVISUALIZACIÓN
                    total={granTotal} 
                    onClose={() => setShowPayment(false)} 
                    onConfirmPayment={handlePaymentSuccess} 
                />
            )}
        </div>
    );
}