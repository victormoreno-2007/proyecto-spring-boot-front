import { api } from "./api";

// Definimos cómo se ve una herramienta en el Frontend
// (Debe coincidir con tu ToolEntity/ToolRequest del Backend)
export interface Tool {
    id?: string;
    name: string;
    description: string;
    pricePerDay: number;
    imageUrl: string;
    status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DELETED';
    providerId: string;
    stock?: number;
}

export const toolService = {
    // 1. Obtener herramientas de UN proveedor específico
    async getToolsByProvider(providerId: string) {
        // Llama a tu endpoint: GET /api/v1/tools/provider/{id}
        const response = await api.get<Tool[]>(`/tools/provider/${providerId}`);
        return response.data;
    },

    // 2. Crear una nueva herramienta
    async createTool(toolData: Tool) {
        // Llama a tu endpoint: POST /api/v1/tools
        const response = await api.post<Tool>('/tools', toolData);
        return response.data;
    },

    // 3. Eliminar herramienta
    async deleteTool(toolId: string) {
        // Llama a tu endpoint: DELETE /api/v1/tools/{id}
        await api.delete(`/tools/${toolId}`);
    },

    // 4. Actualizar herramienta (Opcional por ahora)
    async updateTool(toolId: string, toolData: Partial<Tool>) {
        const response = await api.put<Tool>(`/tools/${toolId}`, toolData);
        return response.data;
    },

    async getToolById(toolId: string) {
        const response = await api.get<Tool>(`/tools/${toolId}`);
        return response.data;
    },

    // En toolService.ts
    async getAllTools() {
        const response = await api.get<Tool[]>('/tools');
        return response.data;
    },
    searchTools: async (query: string): Promise<Tool[]> => {
    if (!query.trim()) {
        const response = await api.get('/tools');
        return response.data;
    }
    const response = await api.get(`/tools/search?name=${query}`);
    return response.data;
  }
};