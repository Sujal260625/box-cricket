import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  MapPin,
  CheckCircle,
  X
} from 'lucide-react';
import { mockStoreItems, StoreItem } from '../../../data/mockData';

interface CartItem extends StoreItem {
  quantity: number;
}

interface OnlineStoreProps {
  currentUser: any;
  onCheckoutComplete: (order: any) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function OnlineStore({ currentUser, onCheckoutComplete, onClose, isModal = true }: OnlineStoreProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'store' | 'cart'>('store');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'sports'>('all');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment' | 'confirm' | 'success'>('cart');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Filter items by category
  const filteredItems = selectedCategory === 'all'
    ? mockStoreItems
    : mockStoreItems.filter(item => item.category === selectedCategory);

  // Add item to cart
  const addToCart = (item: StoreItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Update item quantity in cart
  const updateQuantity = (itemId: string, change: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;

    setCheckoutStep('address');
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    const orderData = {
      userId: currentUser?.id,
      userName: currentUser?.name || 'Guest',
      items: cart.map(item => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      tax,
      total,
      deliveryAddress,
      status: 'confirmed'
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (data.success) {
        onCheckoutComplete(data.order);
        setCheckoutStep('success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const content = (
      <div className={`bg-white rounded-xl ${isModal ? 'max-w-4xl w-full max-h-[90vh] overflow-y-auto' : 'w-full'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold">
              {checkoutStep === 'cart' ? 'Store' :
                checkoutStep === 'address' ? 'Delivery Address' :
                  checkoutStep === 'payment' ? 'Payment' :
                    checkoutStep === 'confirm' ? 'Confirm Order' : 'Order Success'}
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          {checkoutStep === 'cart' && (
            <div>
              <div className="flex gap-4 mb-6 border-b">
                <button
                  onClick={() => setActiveTab('store')}
                  className={`pb-2 px-4 ${activeTab === 'store'
                    ? 'border-b-2 border-green-600 text-green-600 font-medium'
                    : 'text-gray-600'
                    }`}
                >
                  Store
                </button>
                <button
                  onClick={() => setActiveTab('cart')}
                  className={`pb-2 px-4 flex items-center gap-2 ${activeTab === 'cart'
                    ? 'border-b-2 border-green-600 text-green-600 font-medium'
                    : 'text-gray-600'
                    }`}
                >
                  Cart
                  {cart.length > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>

              {activeTab === 'store' ? (
                <div>
                  {/* Category Filter */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['all', 'food', 'sports'] as const).map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-colors ${selectedCategory === category
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {category === 'food' ? 'Food & Drinks' : category === 'sports' ? 'Sports Equipment' : 'All Items'}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden border">
                        <div
                          className="h-40 bg-cover bg-center"
                          style={{ backgroundImage: `url('${item.image}')` }}
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <span className="font-bold text-green-600">₹{item.price.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between items-center mb-3">
                            <span className={`px-2 py-1 rounded text-xs ${item.category === 'food'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                              }`}>
                              {item.category === 'food' ? 'Food' : 'Sports'}
                            </span>
                            <span className="text-sm text-gray-600">Stock: {item.stock}</span>
                          </div>

                          <button
                            onClick={() => addToCart(item)}
                            disabled={item.stock <= 0}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                      <p className="text-gray-600 mb-6">Add some items from the store</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div
                            className="w-16 h-16 bg-cover bg-center rounded"
                            style={{ backgroundImage: `url('${item.image}')` }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right font-medium text-green-600">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}

                      {/* Order Summary */}
                      <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹{tax.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total</span>
                          <span className="text-green-600">₹{total.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mt-4"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {checkoutStep === 'address' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Delivery Address</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Delivery Address *</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Delivery Instructions</label>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="Any special delivery instructions?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCheckoutStep('payment')}
                  disabled={!deliveryAddress}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Payment Method</h3>

              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    </div>
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span>Credit/Debit Card</span>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 mb-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCheckoutStep('address')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCheckoutStep('confirm')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'confirm' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Confirm Order</h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Delivery to</p>
                    <p className="font-medium">{deliveryAddress.split('\n')[0]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">Credit/Debit Card</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Place Order
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your order. Your items will be delivered soon.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Order ID: {`order-${Date.now()}`}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>Delivering to: {deliveryAddress.split('\n')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-bold">Total: ₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {content}
    </div>
  );
}
