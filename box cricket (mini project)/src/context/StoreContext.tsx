import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StoreItem {
    id: string | number;
    itemName: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
}

interface StoreContextType {
    storeItems: StoreItem[];
    loading: boolean;
    updateStock: (id: string | number, newQuantity: number) => Promise<void>;
    refreshStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshStore = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5001/api/inventory');
            const data = await res.json();
            setStoreItems(data.map((item: any) => {
                let imageUrl = item.image;
                if (!imageUrl) {
                    const itemName = (item.itemName || item.name || '').toLowerCase();
                    if (itemName.includes('bat')) imageUrl = 'https://images.unsplash.com/photo-1593341646782-e0bedbbf07ee?auto=format&fit=crop&q=80&w=800';
                    else if (itemName.includes('gloves')) imageUrl = 'https://images.unsplash.com/photo-1562923690-337d1cfbe293?auto=format&fit=crop&q=80&w=800';
                    else if (itemName.includes('energy') || itemName.includes('drink')) imageUrl = 'https://images.unsplash.com/photo-1622543925917-063a1539d486?auto=format&fit=crop&q=80&w=800';
                    else if (itemName.includes('stump')) imageUrl = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800';
                    else if (itemName.includes('ball')) imageUrl = 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800';
                    else if (item.category === 'food' || item.category === 'Food') imageUrl = 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800';
                    else imageUrl = 'https://images.unsplash.com/photo-1518605368461-1ee7e543615e?auto=format&fit=crop&q=80&w=800';
                }

                return {
                    id: item._id,
                    itemName: item.itemName || item.name || 'Unknown Item',
                    price: item.price || 0,
                    quantity: item.quantity || item.stock || 0,
                    image: imageUrl,
                    category: item.category || 'Sports'
                };
            }));
        } catch (error) {
            console.error('Error fetching store items:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (id: string | number, newQuantity: number) => {
        try {
            await fetch(`http://localhost:5001/api/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity })
            });
            await refreshStore();
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    useEffect(() => {
        refreshStore();
    }, []);

    return (
        <StoreContext.Provider value={{ storeItems, loading, updateStock, refreshStore }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
