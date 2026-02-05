import { api } from "./api";

export interface Tool {
    id?: string;
    name: string;
    description: string;
    pricePerDay: number;
    imageUrl: string;
    status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DELETED';
    providerId: string;
}

export const toolService = {
    async getToolsByProvider(providerId: string) {
        const response = await api.get<Tool[]>(`/tools/provider/${providerId}`);
        return response.data;
    },
    async createTool(toolData: Tool) {
        const response = await api.post<Tool>('/tools', toolData);
        return response.data;
    },
    async deleteTool(toolId: string) {
        await api.delete(`/tools/${toolId}`);
    },
    async updateTool(toolId: string, toolData: Partial<Tool>) {
        const response = await api.put<Tool>(`/tools/${toolId}`, toolData);
        return response.data;
    },
    async getToolById(toolId: string) {
        const response = await api.get<Tool>(`/tools/${toolId}`);
        return response.data;
    },
    async getAllTools() {
        const response = await api.get<Tool[]>('/tools');
        return response.data;
    },
    // 👇 Vital para tu catálogo
    async getAvailableTools() {
        const response = await api.get<Tool[]>('/tools');
        return response.data.filter(tool => tool.status === 'AVAILABLE');
    }
};