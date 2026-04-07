import React, { useState } from 'react';
import { Store, Package, IndianRupee, Save, Plus, Minus } from 'lucide-react';

interface StoreItem {
    id: string | number;
    itemName: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
}

interface StoreItemCardProps {
    item: any;
    onUpdate: (itemId: string | number, newData: any) => void;
}

export default function StoreItemCard({ item, onUpdate }: StoreItemCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [stock, setStock] = useState(item.quantity || 0);

    const handleUpdate = () => {
        onUpdate(item.id || item._id, { quantity: stock });
        setIsEditing(false);
    };

    const [imageError, setImageError] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-100 flex items-center justify-center relative group">
                {item.image && !imageError ? (
                    <img 
                      src={item.image} 
                      alt={item.itemName} 
                      className="w-full h-full object-cover" 
                      onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <Store className="w-10 h-10 mb-2" />
                        <span className="text-xs font-semibold">{item.itemName}</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-blue-700 shadow-sm border border-blue-50">
                    {item.category || 'Inventory'}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{item.itemName}</h3>
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                            <IndianRupee className="w-4 h-4" />
                            <span>{item.price}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ₹{
              stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
                            {stock > 10 ? 'In Stock' : 'Low Stock'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setStock(Math.max(0, stock - 1))}
                            className="p-1.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200"
                        >
                            <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="font-mono font-bold text-lg min-w-[2ch] text-center">{stock}</span>
                        <button
                            onClick={() => setStock(stock + 1)}
                            className="p-1.5 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200"
                        >
                            <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={stock === item.quantity}
                        className={`p-2 rounded-lg transition-all ₹{
              stock === item.quantity 
                ? 'text-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
            }`}
                    >
                        <Save className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
