import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, listProducts, getRelatedProducts } from '../lib/api';
import type { Product } from '../lib/api';
import { ProductLayout } from '../components/templates/ProductLayout';
import { ProductDetail } from '../components/molecules/ProductDetail';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { Button } from '../components/atoms/Button';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [productData, allProductsData] = await Promise.all([
          getProduct(id),
          listProducts()
        ]);

        if (!productData) {
          setError('Product not found');
        } else {
          setProduct(productData);
        }
        setAllProducts(allProductsData);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  const relatedProducts = React.useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    return getRelatedProducts(allProducts, product.id, product.tags, 3);
  }, [product, allProducts]);

  if (loading) {
    return (
      <ProductLayout relatedProducts={<div />}>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

            <div className="aspect-square bg-gray-200 rounded-lg"></div>

            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </ProductLayout>
    );
  }

  if (error || !product) {
    return (
      <ProductLayout relatedProducts={<div />}>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Product not found</h2>
          <p className="mt-1 text-sm text-gray-500">{error || 'The product you are looking for does not exist.'}</p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4"
            aria-label="Go back to catalog"
          >
            Back to Catalog
          </Button>
        </div>
      </ProductLayout>
    );
  }


  return (
    <ProductLayout
      relatedProducts={

        relatedProducts.length > 0 ? (
          <section aria-labelledby="related-products-heading" className="mt-12">
            <h2 id="related-products-heading" className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        ) : null
      }
    >

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

        <div className="flex justify-center">
          <div className="w-full max-w-md aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="eager" 
            />
          </div>
        </div>

        <div className="flex flex-col">
          <ProductDetail product={product} />
          <Button
            onClick={() => navigate('/cart')}
            className="block mx-auto mt-6 w-fit px-4 py-2"
            variant='secondary'
            aria-label="Go to cart">
              view cart
          </Button>
        </div>
      </div>
    </ProductLayout>

  );
};

export default ProductPage;