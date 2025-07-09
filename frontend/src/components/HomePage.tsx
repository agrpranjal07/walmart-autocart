'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';
import ProductTable from './ProductTable';
import Header from './Header';

export interface Product {
  name: string;
  quantity: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([{ name: '', quantity: 1 }]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleProductChange = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: 1 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    const validProducts = products.filter(p => p.name.trim() !== '');
    if (validProducts.length === 0) {
      alert('Please add at least one product');
      return;
    }

    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/process-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: validProducts }),
      });

      if (response.ok) {
        const results = await response.json();
        // Store results in localStorage for the results page
        if (typeof window !== 'undefined') {
          localStorage.setItem('searchResults', JSON.stringify(results));
        }
        router.push('/results');
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to process products: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-walmart-lightGray">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card-walmart p-8 mb-8">
          <h1 className="text-4xl font-bold text-walmart-darkBlue mb-2 text-center">
            Smart Shopping Assistant
          </h1>
          <p className="text-walmart-darkGray text-center mb-8 text-lg">
            Enter your shopping list or upload an image to find the best products
          </p>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-walmart-blue rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h2 className="text-2xl font-semibold text-walmart-darkBlue">
                  Upload or Capture
                </h2>
              </div>
              <FileUpload onProductsExtracted={setProducts} />
            </div>
            
            {/* Manual Entry Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-walmart-blue rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h2 className="text-2xl font-semibold text-walmart-darkBlue">
                  Manual Entry
                </h2>
              </div>
              <ProductTable
                products={products}
                onProductChange={handleProductChange}
                onAddProduct={addProduct}
                onRemoveProduct={removeProduct}
              />
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-walmart-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Find Products'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
