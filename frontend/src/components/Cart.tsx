'use client';

import { CartItem } from './ResultsPage';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
  total: number;
}

export default function Cart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  couponCode, 
  onCouponChange, 
  onApplyCoupon, 
  onCheckout, 
  total 
}: CartProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
      <h2 className="text-xl font-bold text-walmart-darkBlue mb-4">
        Shopping Cart ({items.length})
      </h2>
      
      {items.length === 0 ? (
        <p className="text-center text-walmart-darkGray py-8">
          Your cart is empty
        </p>
      ) : (
        <>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/50x50/E5E5E5/666666?text=No+Image';
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-walmart-darkBlue truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm text-walmart-blue font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                  
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Coupon Section */}
          <div className="border-t pt-4 mb-4">
            <h3 className="text-sm font-semibold text-walmart-darkBlue mb-2">
              Coupon Code
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => onCouponChange(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
              />
              <button
                onClick={onApplyCoupon}
                disabled={!couponCode.trim()}
                className="bg-walmart-yellow hover:bg-yellow-400 text-walmart-blue px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
            <p className="text-xs text-walmart-darkGray mt-1">
              Try: SAVE10 or WELCOME
            </p>
          </div>
          
          {/* Total */}
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-walmart-darkGray">Subtotal:</span>
              <span className="text-sm font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-walmart-darkGray">Shipping:</span>
              <span className="text-sm font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-walmart-darkBlue">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            className="w-full bg-walmart-blue hover:bg-walmart-darkBlue text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
