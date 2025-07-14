'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';
import ProductTable from './ProductTable';
import Header from './Header';

export interface Product {
  name: string;
  quantity: number;
  details: string; // Add this new field
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // const processText = async () => {
  //   if (!textInput.trim()) return;
    
  //   setIsProcessing(true);
  //   try {
  //     const nlpUrl = process.env.NEXT_PUBLIC_NLP_SERVICE_URL || 'http://localhost:4001';
  //     const response = await fetch(`${nlpUrl}/api/extract-products`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ 
  //         type: 'text', 
  //         data: textInput 
  //       }),
  //     });

  //     if (response.ok) {
  //       const extractedProducts = await response.json();
  //       setProducts(extractedProducts);
  //       setTextInput('');
  //     } else {
  //       throw new Error('Failed to process text');
  //     }
  //   } catch (error) {
  //     console.error('Error processing text:', error);
  //     alert('Error processing text. Please try again.');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  // const handleFindProducts = () => {
  //   if (textInput.trim()) {
  //     processText();
  //   }
  //   // Add any other "Find Products" functionality here
  // };

  const handleProductChange = (index: number, field: 'name' | 'quantity' | 'details', value: string | number) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: 1, details: '' }]);
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

    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200/50 p-8 mb-8 
          transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
              from-walmart-blue via-blue-600 to-walmart-blue mb-2 tracking-tight">
              Autocart Assistant
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Got a list? Type or snap it — we’ll find you the best prices!
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-walmart-yellow to-transparent mx-auto"></div>
          </div>
          
          {/* Grid Section */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upload Section with enhanced styling */}
            <div className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl 
              border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-walmart-blue to-blue-600 rounded-full 
                  flex items-center justify-center text-white font-bold shadow-md 
                  transform transition hover:scale-110 hover:rotate-3">
                  1
                </div>
                <h2 className="text-2xl font-semibold text-walmart-blue">
                  Upload or Capture
                </h2>
              </div>
              <FileUpload onProductsExtracted={setProducts} textInput={textInput} setTextInput={setTextInput} />
            </div>
            
            {/* Manual Entry Section with enhanced styling */}
            <div className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl 
              border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-walmart-blue to-blue-600 rounded-full 
                  flex items-center justify-center text-white font-bold shadow-md 
                  transform transition hover:scale-110 hover:rotate-3">
                  2
                </div>
                <h2 className="text-2xl font-semibold text-walmart-blue">
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
          
          {/* Enhanced Button Section */}
          <div className="mt-12 text-center">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="group bg-gradient-to-r from-walmart-blue to-blue-600 text-white font-bold text-lg 
                px-12 py-4 rounded-xl shadow-lg transform transition-all duration-300 
                hover:-translate-y-1 hover:shadow-xl hover:from-blue-600 hover:to-walmart-blue
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Find Products</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
