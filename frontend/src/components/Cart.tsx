'use client';

import { CartItem } from './ResultsPage';

interface CouponDiscount {
  type: 'percentage' | 'fixed';
  value: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
  total: number;
  appliedCoupon: string | null;
  discount: CouponDiscount | null;
}

export default function Cart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  couponCode, 
  onCouponChange, 
  onApplyCoupon, 
  onCheckout, 
  total,
  appliedCoupon,
  discount
}: CartProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
      {/* Cart Header */}
      <div className="bg-gradient-to-r from-walmart-blue to-blue-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            Shopping Cart
            <span className="text-sm bg-walmart-yellow text-walmart-blue px-2 py-0.5 rounded-full ml-2">
              {items.length}
            </span>
          </h2>
        </div>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-walmart-darkBlue line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-walmart-blue hover:text-walmart-darkBlue"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-walmart-blue hover:text-walmart-darkBlue"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-medium">
                        ${((item.price.price / 100) * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-auto"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Section */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-walmart-blue/20 
              focus:border-walmart-blue outline-none text-sm"
          />
          <button
            onClick={onApplyCoupon}
            className="bg-walmart-blue text-white px-4 py-2 rounded-lg hover:bg-walmart-darkBlue 
              transition-colors text-sm font-medium"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Cart Total */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-walmart-darkBlue">Subtotal:</span>
            <span className="text-walmart-darkBlue">
              ${(items.reduce((total, item) => total + (item.price.price / 100 * item.quantity), 0)).toFixed(2)}
            </span>
          </div>
          
          {appliedCoupon && discount && (
            <div className="flex items-center justify-between text-green-600">
              <span>Discount ({appliedCoupon}):</span>
              <span>
                {discount.type === 'percentage' 
                  ? `-${discount.value}%`
                  : `-$${discount.value.toFixed(2)}`
                }
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between font-bold text-walmart-darkBlue pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span className="text-xl">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full bg-gradient-to-r from-walmart-blue to-blue-600 text-white font-bold py-3 
            rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 
            hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed 
            disabled:hover:transform-none flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
