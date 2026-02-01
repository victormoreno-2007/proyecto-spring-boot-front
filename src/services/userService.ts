import { api } from "./api";
import type { User } from '../types/auth';

export const userService = {
    async getAllUsers () {
        const response = await api.get<User[]> ('/users');
        return response.data;
    },
    async createUser(userData: any) {
        // Enviamos los datos del formulario al backend
        const response = await api.post<User>('/users', userData);
        return response.data;
    },

    async deleteUser(id: String) {
        await api.delete(`/users/${id}`);
    }
}