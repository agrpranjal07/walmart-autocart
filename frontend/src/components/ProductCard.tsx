'use client';

import { WalmartProduct } from './ResultsPage';

interface ProductCardProps {
  product: WalmartProduct;
  isSelected: boolean;
  onSelect: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({ product, isSelected, onSelect, onAddToCart }: ProductCardProps) {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-walmart-blue bg-walmart-lightBlue shadow-lg' 
          : 'border-gray-200 hover:border-walmart-blue hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/200x200/E5E5E5/666666?text=No+Image';
          }}
        />
      </div>
      
      <h3 className="font-semibold text-sm text-walmart-darkBlue mb-2 line-clamp-2">
        {product.name}
      </h3>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-walmart-blue">
          ${product.price.toFixed(2)}
        </span>
        
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
