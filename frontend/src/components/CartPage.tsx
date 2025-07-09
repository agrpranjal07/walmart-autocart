'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import { CartItem } from './ResultsPage';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    return subtotal - discount;
  };

  const applyCoupon = () => {
    const code = couponCode.toLowerCase();
    if (code === 'save10') {
      setDiscount(getSubtotal() * 0.1);
      setAppliedCoupon('SAVE10 - 10% off');
      setCouponCode('');
    } else if (code === 'welcome') {
      setDiscount(5);
      setAppliedCoupon('WELCOME - $5 off');
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon('');
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Mock checkout process
    alert(`Checkout successful! Total: $${getTotal().toFixed(2)}`);
    setCart([]);
    setDiscount(0);
    setAppliedCoupon('');
    router.push('/');
  };

  const continueShopping = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-walmart-light-gray">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-walmart-dark-blue mb-2">Shopping Cart</h1>
          <p className="text-walmart-dark-gray">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        {cart.length === 0 ? (
          <div className="card-walmart p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-walmart-light-blue rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-walmart-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L8 7m0 6l-1.5 1.5M7 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-walmart-dark-blue mb-4">Your cart is empty</h2>
            <p className="text-walmart-dark-gray mb-8">Start shopping to add items to your cart</p>
            <button
              onClick={continueShopping}
              className="btn-walmart-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="card-walmart p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-walmart border border-walmart-medium-gray"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/80x80/E5E5E5/666666?text=No+Image';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-walmart-dark-blue mb-2">
                        {item.name}
                      </h3>
                      <p className="text-walmart-blue font-semibold text-xl">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.rating && (
                        <div className="flex items-center mt-1">
                          <div className="flex items-center text-yellow-500">
                            <span className="text-sm">★</span>
                            <span className="text-sm ml-1">{item.rating.toFixed(1)}</span>
                          </div>
                          {item.reviews && (
                            <span className="text-xs text-walmart-dark-gray ml-2">
                              ({item.reviews} reviews)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-walmart-medium-gray rounded hover:bg-walmart-light-gray transition-colors"
                        >
                          -
                        </button>
                        
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-walmart-medium-gray rounded hover:bg-walmart-light-gray transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-walmart p-6 sticky top-8">
                <h2 className="text-xl font-bold text-walmart-dark-blue mb-6">Order Summary</h2>
                
                {/* Coupon Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-walmart-dark-blue mb-3">Coupon Code</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="input-walmart flex-1"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                      className="btn-walmart-yellow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-walmart-dark-gray mt-2">Try: SAVE10 or WELCOME</p>
                  
                  {appliedCoupon && (
                    <div className="mt-3 p-3 bg-walmart-light-blue rounded-walmart flex items-center justify-between">
                      <span className="text-sm font-medium text-walmart-dark-blue">{appliedCoupon}</span>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 pb-4 border-b border-walmart-medium-gray">
                  <div className="flex justify-between items-center">
                    <span className="text-walmart-dark-gray">Subtotal:</span>
                    <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-walmart-green">
                      <span>Discount:</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-walmart-dark-gray">Shipping:</span>
                    <span className="font-semibold text-walmart-green">FREE</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-walmart-dark-gray">Tax:</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xl font-bold text-walmart-dark-blue pt-4 mb-6">
                  <span>Total:</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={checkout}
                    className="btn-walmart-primary w-full text-lg py-4"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={continueShopping}
                    className="btn-walmart-secondary w-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
