'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import ProductCard from './ProductCard';
import Cart from './Cart';

export interface WalmartProduct {
  id: string;
  name: string;
  price: number;
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

export default function ResultsPage() {
  const [searchResults, setSearchResults] = useState<ProductSearchResult>({});
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: string}>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load results from localStorage
    const savedResults = localStorage.getItem('searchResults');
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
    setIsLoading(false);
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
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === 'save10') {
      alert('Coupon applied! 10% discount');
    } else if (couponCode.toLowerCase() === 'welcome') {
      alert('Welcome coupon applied! $5 off');
    } else {
      alert('Invalid coupon code');
    }
  };

  const addAllToCart = () => {
    Object.keys(selectedProducts).forEach(productName => {
      addToCart(productName, 1);
    });
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
    <div className="min-h-screen bg-walmart-gray">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-walmart-darkBlue mb-6">
                Product Search Results
              </h1>
              
              {Object.keys(searchResults).length === 0 ? (
                <p className="text-center text-walmart-darkGray py-8">
                  No results found. Please try again.
                </p>
              ) : (
                <div className="space-y-8">
                  {Object.entries(searchResults).map(([productName, products]) => (
                    <div key={productName} className="border-b pb-6 last:border-b-0">
                      <h2 className="text-xl font-semibold text-walmart-darkBlue mb-4 capitalize">
                        {productName}
                      </h2>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isSelected={selectedProducts[productName] === product.id}
                            onSelect={() => selectProduct(productName, product.id)}
                            onAddToCart={() => addToCart(productName, 1)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {Object.keys(searchResults).length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={addAllToCart}
                    className="bg-walmart-blue hover:bg-walmart-darkBlue text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Add All Selected to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Cart
              items={cart}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
              onApplyCoupon={applyCoupon}
              onCheckout={checkout}
              total={getCartTotal()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
