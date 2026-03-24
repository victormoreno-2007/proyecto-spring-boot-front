import { api } from './api';
import type { LoginResponse} from '../types/auth';

export interface RegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const authService = {

    async login(credentials: {email: string, password: string}) {
        
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        
    
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        
        return response.data;
    },

    register: async (data: RegisterDTO) => {
        const response = await api.post<LoginResponse>('/auth/register', data);
        return response.data;
    },

    logout(){
        localStorage.removeItem('accessToken');
    }
}