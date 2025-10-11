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
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      stockQty: product.stockQty,
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden" aria-labelledby={`product-title-${product.id}`}>
      <div className="p-6 space-y-6">
 
        <div className="space-y-3">
          <h1 
            id={`product-title-${product.id}`}
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            {product.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <PriceDisplay amount={product.price} className="text-2xl"/>
            <StockIndicator stockQty={product.stockQty} />
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
            disabled={product.stockQty === 0}
            className="w-full py-3 text-lg"
            aria-label={`Add ${product.title} to cart`}
          >
            {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </article>
  );
};