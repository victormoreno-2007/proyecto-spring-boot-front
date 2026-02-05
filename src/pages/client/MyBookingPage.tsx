import { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../../services/bookingService';
import '../../pages/user/UsersPage.css'; 

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    
    useEffect(() => {
        bookingService.getMyHistory().then(setBookings).catch(console.error);
    }, []);

    return (
        <div style={{ marginTop: '20px' }}>
            <h2 style={{color: 'var(--imperial-blue)'}}>📋 Herramientas Alquiladas</h2>
            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Reserva #</th>
                            <th>Fechas</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? <tr><td colSpan={4} style={{textAlign:'center', padding:'2rem'}}>Sin reservas.</td></tr> : 
                        bookings.map(b => (
                            <tr key={b.id}>
                                <td>{b.id.substring(0,8)}</td>
                                <td>{b.startDate.split('T')[0]} - {b.endDate.split('T')[0]}</td>
                                <td>${b.totalPrice.toLocaleString()}</td>
                                <td><span className="role-badge role-customer">{b.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}