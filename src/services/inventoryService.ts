const API_URL = import.meta.env.VITE_API_URL || 'https://box-cricket-qt23.onrender.com/api';

export interface InventoryItem {
    id: string;
    itemName: string;
    quantity: number;
    category: string;
    price: number;
    minStock: number;
    maxStock: number;
    storeLocation: string;
    supplier: string;
    totalSold: number;
    condition: string;
}

export const inventoryService = {
    async getInventory() {
        try {
            const response = await fetch(`${API_URL}/inventory`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching inventory:', error);
            return [];
        }
    },

    async createItem(itemData: any) {
        try {
            const response = await fetch(`${API_URL}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating inventory item:', error);
            return { success: false };
        }
    },

    async updateItem(id: string, itemData: any) {
        try {
            const response = await fetch(`${API_URL}/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating inventory item:', error);
            return { success: false };
        }
    },

    async deleteItem(id: string) {
        try {
            const response = await fetch(`${API_URL}/inventory/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            return { success: false };
        }
    }
};
