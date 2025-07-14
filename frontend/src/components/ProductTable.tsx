'use client';

import { Product } from './HomePage';

interface ProductTableProps {
  products: Product[];
  onProductChange: (index: number, field: 'name' | 'quantity' | 'details', value: string | number) => void;
  onAddProduct: () => void;
  onRemoveProduct: (index: number) => void;
}

export default function ProductTable({ 
  products, 
  onProductChange, 
  onAddProduct, 
  onRemoveProduct 
}: ProductTableProps) {
  return (
    <div className="space-y-6">
      <div className="card-walmart rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-walmart-lightBlue">
            <tr>
              <th className="text-left p-4 font-semibold text-walmart-darkBlue">Product Name</th>
              <th className="text-left p-4 font-semibold text-walmart-darkBlue w-24">Qty</th>
              <th className="text-left p-4 font-semibold text-walmart-darkBlue">Details</th>
              <th className="text-left p-4 font-semibold text-walmart-darkBlue w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (products.map((product, index) => (
              <tr key={index} className="border-t border-walmart-mediumGray hover:bg-walmart-lightGray transition-colors">
                <td className="p-4">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => onProductChange(index, 'name', e.target.value)}
                    placeholder="Enter product name"
                    className="input-walmart w-full"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => onProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    className="input-walmart w-full"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={product.details || ''}
                    onChange={(e) => onProductChange(index, 'details', e.target.value)}
                    placeholder="Add specifications, brand, size, etc."
                    className="input-walmart w-full"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onRemoveProduct(index)}
                    // disabled={false}
                    className="text-red-500 cursor-pointer  hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded transition-colors"
                    title="Remove product"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))) : (
                <tr>
      <td colSpan={4} className="p-4 text-center text-walmart-darkBlue">
        No products. Click “Add Another Product” to start.
      </td>
    </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <button
        onClick={onAddProduct}
        className="btn-walmart-secondary cursor-pointer w-full flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Another Product</span>
      </button>
    </div>
  );
}
