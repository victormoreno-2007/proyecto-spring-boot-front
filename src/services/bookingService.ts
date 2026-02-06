import { api } from "./api";
import type { Tool } from "./toolService"; 

export interface Booking {
    id: string;
    userId: string;
    toolId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentId?: string;
    tool?: Tool; 
}

export const bookingService = {
   // Ver mi historial 
    async getMyBookings() {
        const response = await api.get<Booking[]>('/bookings/my-history');
        return response.data;
    },

    //  Reportar daño de llegada 
    async reportArrivalIssue(bookingId: string, description: string) {
        await api.post(`/bookings/${bookingId}/report-arrival-issue`, {
            damageDescription: description,
            withDamage: true, 
            repairCost: 0
        });
    },

    //  Traer quejas 
    async getAllDamageReports() {
        const response = await api.get<any[]>('/damage-reports');
        return response.data;
    },

    async createBooking(bookingData: { toolId: string; startDate: string; endDate: string }) {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },
    async getMyHistory() {
        const response = await api.get<Booking[]>('/bookings/my-history');
        return response.data;
    },
    async confirmPayment(bookingId: string, paymentMethod: string) {
        const payload = { 
            paymentId: `PAY-${Date.now()}-${paymentMethod}` 
        };
        await api.post(`/bookings/${bookingId}/confirm-payment`, payload);
    },
    async getProviderBookings(providerId: string) {
        const response = await api.get<Booking[]>(`/bookings/provider/${providerId}`);
        return response.data;
    },
    async registerReturn(bookingId: string, data: { withDamage: boolean; damageDescription: string; repairCost: number }) {
        await api.post(`/bookings/${bookingId}/return`, data);
    }
};