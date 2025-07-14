'use client';

import { WalmartProduct } from './ResultsPage';

interface ProductCardProps {
  product: WalmartProduct;
  isSelected: boolean;
  onSelect: () => void;
  onAddToCart: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function ProductCard({ product, isSelected, onSelect, onAddToCart, size = 'medium' }: ProductCardProps) {
  const imageSize = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64'
  }[size];


  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-walmart-blue bg-walmart-lightBlue shadow-lg' 
          : 'border-gray-200 hover:border-walmart-blue hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <div className={`relative ${imageSize} bg-gray-100`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/200x200/E5E5E5/666666?text=No+Image';
          }}
        />
      </div>
      
      <h3 className="font-semibold text-sm text-walmart-darkBlue mb-2">
        {product.name}
      </h3>
      
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold text-walmart-darkBlue">
          ${(product.price.price / 100).toFixed(2)}
        </div>
        
        {product.rating && (
          <div className="flex items-center text-yellow-500">
            <span className="text-sm">★</span>
            <span className="text-xs ml-1">
              {product.rating.toFixed(1)}

            </span>
            {product.reviews && (
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviews})
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-walmart-blue text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="bg-walmart-yellow hover:bg-yellow-400 text-walmart-blue py-2 px-3 rounded text-sm font-medium transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
