import React from 'react';
import type { Product } from '../../lib/api';
import { ProductCard } from '../molecules/ProductCard';
import { Icon } from '../atoms/Icon';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false }) => {

  if (loading) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
            </div>
          </li>
        ))}
      </ul>
    );
  }


  if (products.length === 0) {
    return (
      <div className="text-center py-12" role="status">
        <Icon className='h-12 w-12 text-gray-400 mx-auto' d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }


  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      aria-label="Products grid"
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
};
