'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import ProductCard from './ProductCard';
import Cart from './Cart';

export interface WalmartProduct {
  id: string;
  name: string;
  price: {
    price: number;
    currency: string;
    price_min: number;
    price_max: number;
  };
  image: string;
  rating?: number;
  reviews?: number;
}

export interface ProductSearchResult {
  [productName: string]: WalmartProduct[];
}

export interface CartItem extends WalmartProduct {
  quantity: number;
}

// Add this interface for coupons
interface CouponDiscount {
  type: 'percentage' | 'fixed';
  value: number;
}

export default function ResultsPage() {
  const [searchResults, setSearchResults] = useState<ProductSearchResult>({});
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: string}>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Add this coupon lookup object
  const VALID_COUPONS: { [key: string]: CouponDiscount } = {
    'SAVE10': { type: 'percentage', value: 10 },
    'SAVE20': { type: 'percentage', value: 20 },
    'WELCOME5': { type: 'fixed', value: 5 },
    'SUMMER15': { type: 'percentage', value: 15 },
    'EXTRA25': { type: 'fixed', value: 25 },
    'FLASH30': { type: 'percentage', value: 30 },
  };

  useEffect(() => {
    try {
      // Load results from localStorage
      const savedResults = localStorage.getItem('searchResults');
      const savedCart = localStorage.getItem('cart');

      if (savedResults) {
        const results = JSON.parse(savedResults);
        setSearchResults(results);
        
        // Auto-select first product for each category
        const initialSelections: {[key: string]: string} = {};
        Object.keys(results).forEach(productName => {
          if (results[productName].length > 0) {
            initialSelections[productName] = results[productName][0].id;
          }
        });
        setSelectedProducts(initialSelections);
      } else {
        router.push('/');
      }

      // Load cart
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing page:', error);
      router.push('/');
    }
  }, [router]);

  const selectProduct = (productName: string, productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productName]: productId
    }));
  };

  const getSelectedProduct = (productName: string): WalmartProduct | null => {
    const productId = selectedProducts[productName];
    if (!productId) return null;
    
    const products = searchResults[productName] || [];
    return products.find(p => p.id === productId) || null;
  };

  const addToCart = (productName: string, quantity: number = 1) => {
    const product = getSelectedProduct(productName);
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    const newCart = existingItem
      ? cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cart, { ...product, quantity }];
    
    setCart(newCart);
    
    // Save to localStorage for cart page
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      
      const currentCart = [...cart];
      const newCart = currentCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      // Get current cart from state
      const currentCart = [...cart];
      // Filter out the item to be removed
      const newCart = currentCart.filter(item => item.id !== productId);
      setCart(newCart);
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Update the getCartTotal function
  const getCartTotal = () => {
    const subtotal = cart.reduce((total, item) => {
      const itemPrice = item.price?.price ? item.price.price / 100 : 0;
      return total + (itemPrice * item.quantity);
    }, 0);

    if (!appliedCoupon || !VALID_COUPONS[appliedCoupon]) {
      return subtotal;
    }

    const discount = VALID_COUPONS[appliedCoupon];
    if (discount.type === 'percentage') {
      return subtotal * (1 - discount.value / 100);
    } else {
      return Math.max(0, subtotal - discount.value);
    }
  };

  // Update the applyCoupon function
  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    const discount = VALID_COUPONS[code];

    if (discount) {
      const message = discount.type === 'percentage'
        ? `${discount.value}% discount applied!`
        : `$${discount.value.toFixed(2)} discount applied!`;
      
      setAppliedCoupon(code);
      setCouponCode('');
      
      // Show success message
      alert(`Coupon applied successfully! ${message}`);
    } else {
      // Show error message
      alert('Invalid coupon code. Try SAVE10, WELCOME5, SUMMER15, etc.');
    }
  };

  const addAllToCart = () => {
    // Get all selected products
    const selectedItems = Object.entries(selectedProducts).map(([productName, productId]) => {
      const product = searchResults[productName]?.find(p => p.id === productId);
      return product ? { ...product, quantity: 1 } : null;
    }).filter((item): item is CartItem => item !== null);

    // Filter out items that are already in cart
    const newItems = selectedItems.filter(item => 
      !cart.some(cartItem => cartItem.id === item.id)
    );

    // Add all new items at once
    if (newItems.length > 0) {
      const updatedCart = [...cart, ...newItems];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Please add items to cart first');
      return;
    }
    
    // Mock checkout process
    alert(`Checkout successful! Total: $${getCartTotal().toFixed(2)}`);
    setCart([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-walmart-gray flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-walmart-blue"></div>
          <p className="mt-4 text-walmart-darkBlue">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200/50 p-8 mb-8 
          transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
          
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
              from-walmart-blue via-blue-600 to-walmart-blue tracking-tight">
              Product Search Results
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-walmart-yellow to-transparent mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Results Section */}
            <div className="lg:col-span-2">
              {Object.keys(searchResults).length === 0 ? (
                <div className="text-center text-walmart-darkGray py-12 bg-gray-50 rounded-xl">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg">No results found. Please try again.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(searchResults).map(([productName, products]) => {
                    const selectedProduct = getSelectedProduct(productName);
                    const suggestions = products.filter(p => p.id !== selectedProduct?.id);

                    return (
                      <div key={productName} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl 
                        border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <h2 className="text-xl font-semibold text-walmart-blue mb-6 capitalize flex items-center gap-2">
                          <svg className="w-5 h-5 text-walmart-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          {productName}
                        </h2>
                        
                        <div className="flex flex-col lg:flex-row gap-8">
                          {selectedProduct && (
                            <div className="lg:w-2/5">
                              <div className="sticky top-24">
                                <ProductCard
                                  product={selectedProduct}
                                  isSelected={true}
                                  onSelect={() => {}}
                                  onAddToCart={() => addToCart(productName, 1)}
                                  size="medium"
                                />
                              </div>
                            </div>
                          )}
                          
                          {suggestions.length > 0 && (
                            <div className="lg:w-3/5">
                              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <h3 className="text-sm font-medium text-walmart-darkBlue p-3 bg-gradient-to-r from-walmart-lightBlue/30 to-transparent">
                                  Other Suggestions
                                </h3>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-walmart-lightBlue/30">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-walmart-darkBlue uppercase tracking-wider">
                                          Product
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-walmart-darkBlue uppercase tracking-wider w-20">
                                          Price
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-walmart-darkBlue uppercase tracking-wider w-24">
                                          Rating
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-walmart-darkBlue uppercase tracking-wider w-20">
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {suggestions.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                          <td className="px-3 py-2">
                                            <div className="flex items-center space-x-2">
                                              <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-8 w-8 object-cover rounded" // Reduced image size
                                              />
                                              <button
                                                onClick={() => selectProduct(productName, product.id)}
                                                className="text-xs text-walmart-blue hover:text-walmart-darkBlue hover:underline text-left"
                                                style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}  // Add these styles
                                              >
                                                {product.name}
                                              </button>
                                            </div>
                                          </td>
                                          <td className="px-3 py-2 text-xs">
                                            ${product.price.price.toFixed(2)}
                                          </td>
                                          <td className="px-3 py-2">
                                            <div className="flex items-center">
                                              <span className="text-yellow-400 text-xs">★</span>
                                              <span className="text-xs ml-1">
                                                {product.rating || 'N/A'}
                                              </span>
                                              {product.reviews && (
                                                <span className="text-xs text-gray-500 ml-1">
                                                  ({product.reviews})
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-3 py-2">
                                            <button
                                              onClick={() => selectProduct(productName, product.id)}
                                              className="text-xs bg-walmart-blue text-white px-2 py-1 rounded hover:bg-walmart-darkBlue transition-colors"
                                            >
                                              Select
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Add All to Cart Button */}
              {Object.keys(searchResults).length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={addAllToCart}
                    className="group bg-gradient-to-r from-walmart-blue to-blue-600 text-white font-bold text-lg 
                      px-12 py-4 rounded-xl shadow-lg transform transition-all duration-300 
                      hover:-translate-y-1 hover:shadow-xl hover:from-blue-600 hover:to-walmart-blue"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Add All Selected to Cart</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Cart Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Cart
                  items={cart}
                  onUpdateQuantity={updateCartQuantity}
                  onRemoveItem={removeFromCart}
                  couponCode={couponCode}
                  onCouponChange={setCouponCode}
                  onApplyCoupon={applyCoupon}
                  onCheckout={checkout}
                  total={getCartTotal()}
                  appliedCoupon={appliedCoupon} // Add this prop
                  discount={appliedCoupon ? VALID_COUPONS[appliedCoupon] : null} // Add this prop
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
