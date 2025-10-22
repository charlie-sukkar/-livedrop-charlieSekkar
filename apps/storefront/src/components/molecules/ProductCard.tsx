import React from 'react';
import type { Product } from '../../lib/api';
import { Button } from '../atoms/Button';
import { useCartStore } from '../../lib/store';
import { Link } from 'react-router-dom';
import { PriceDisplay } from '../atoms/PriceDisplay';
import { StockIndicator } from '../atoms/StockIndicator';
import { Tag } from '../atoms/Tag';

interface ProductCardProps {
  product: Product;
  loading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, loading = false }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,        // ✅ Changed: product.id → product._id
      title: product.name,           // ✅ Changed: product.title → product.name
      price: product.price,
      image: product.imageUrl,       // ✅ Changed: product.image → product.imageUrl
      stockQty: product.stock,       // ✅ Changed: product.stockQty → product.stock
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse flex flex-col h-full">
        <div className="aspect-square bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <article
      className="bg-white  rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
      aria-labelledby={`product-title-${product._id}`}  // ✅ Changed: product.id → product._id
    >
      <Link 
        to={`/p/${product._id}`}  // ✅ Changed: product.id → product._id
        className="relative aspect-square bg-gray-100 block"
      >
        <img
          src={product.imageUrl}  // ✅ Changed: product.image → product.imageUrl
          alt={product.name}      // ✅ Changed: product.title → product.name
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link to={`/p/${product._id}`}>  {/* ✅ Changed: product.id → product._id */}
            <h3
              id={`product-title-${product._id}`}  // ✅ Changed: product.id → product._id
              className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
            >
              {product.name}  {/* ✅ Changed: product.title → product.name */}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} className='bg-gray-50' />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
         <PriceDisplay amount={product.price} />
         <div className="flex items-center gap-2">
            <StockIndicator stockQty={product.stock} showBackground={false} showPulse={false} />  {/* ✅ Changed: product.stockQty → product.stock */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}  // ✅ Changed: product.stockQty → product.stock
              aria-label={`Add ${product.name} to cart`}  // ✅ Changed: product.title → product.name
              size="sm"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
