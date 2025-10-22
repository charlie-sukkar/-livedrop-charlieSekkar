import React from 'react';
import type { Product } from '../../lib/api';
import { Button } from '../atoms/Button';
import { StockIndicator } from '../atoms/StockIndicator';
import { useCartStore } from '../../lib/store';
import { PriceDisplay } from '../atoms/PriceDisplay';
import { Tag } from '../atoms/Tag';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
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

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden" aria-labelledby={`product-title-${product._id}`}>  {/* ✅ Changed: product.id → product._id */}
      <div className="p-6 space-y-6">
 
        <div className="space-y-3">
          <h1 
            id={`product-title-${product._id}`}  // ✅ Changed: product.id → product._id
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            {product.name}  {/* ✅ Changed: product.title → product.name */}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <PriceDisplay amount={product.price} className="text-2xl"/>
            <StockIndicator stockQty={product.stock} />  {/* ✅ Changed: product.stockQty → product.stock */}
          </div>
        </div>


        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
           <Tag key={tag} label={tag} />
          ))}
        </div>


        <div className="pt-4">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}  // ✅ Changed: product.stockQty → product.stock
            className="w-full py-3 text-lg"
            aria-label={`Add ${product.name} to cart`}  // ✅ Changed: product.title → product.name
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}  {/* ✅ Changed: product.stockQty → product.stock */}
          </Button>
        </div>
      </div>
    </article>
  );
};