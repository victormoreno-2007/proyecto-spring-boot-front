import { api } from './api';

export interface Payment {
    id: string;
    amount: number;
    paymentDate: string;
    method: string;
    status: string;
    bookingId: string;
}

const paymentService = {
    getMyPayments: async (): Promise<Payment[]> => {
        const response = await api.get('/payments/my-payments'); 
        return response.data;
    }
};

export default paymentService;