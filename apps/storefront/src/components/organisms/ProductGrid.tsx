import React from 'react';
import type { Product } from '../../lib/api';
import { ProductCard } from '../molecules/ProductCard';
import { Icon } from '../atoms/Icon';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false,
  pagination,
  onPageChange 
}) => {
  if (loading) {
    return (
      <div>
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
      </div>
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
    <div>
      {/* Product Count */}
      {pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {products.length} of {pagination.total} products
          {pagination.pages > 1 && ` (Page ${pagination.page} of ${pagination.pages})`}
        </div>
      )}

      {/* Products Grid */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        aria-label="Products grid"
      >
        {products.map((product) => (
          <li key={product._id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600 min-w-[120px] text-center">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};