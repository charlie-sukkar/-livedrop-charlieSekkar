import React, { useState, useEffect } from 'react';
import { listProducts } from '../lib/api';
import type { Product, ProductsResponse } from '../lib/api';
import { CatalogLayout } from '../components/templates/CatalogLayout';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { SearchBox } from '../components/molecules/SearchBox';
import { ProductFilters } from '../components/organisms/ProductFilters';

type SortOption = 'name' | 'price' | 'price-desc';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]); // ✅ Store ALL tags separately
  const [loading, setLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true); // ✅ Separate loading for tags
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // ✅ Load ALL tags once on mount (without filters)
  useEffect(() => {
    const loadAllTags = async () => {
      try {
        setTagsLoading(true);
        // Get first page of all products to extract tags
        const response: ProductsResponse = await listProducts({
          page: 1,
          limit: 1000 // Get enough products to have all tags
        });
        
        // Extract ALL unique tags from the entire catalog
        const tags = response.items.flatMap(product => product.tags);
        const uniqueTags = Array.from(new Set(tags)).sort();
        setAllTags(uniqueTags);
      } catch (error) {
        console.error('Failed to load tags:', error);
        setAllTags([]);
      } finally {
        setTagsLoading(false);
      }
    };
    
    loadAllTags();
  }, []);

  // ✅ TRUE SERVER-SIDE: Load products with backend filtering
  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      
      // ✅ Send filters to BACKEND - backend does the work
      const response: ProductsResponse = await listProducts({
        search: searchQuery || undefined,        
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sort: sortBy,                           
        page: page,                             
        limit: pagination.limit                 
      });
      
      setProducts(response.items);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reload when filters change - BACKEND does the filtering
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts(1);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTags, sortBy]);

  // ✅ Load initial products
  useEffect(() => {
    loadProducts(1);
  }, []);

  // ✅ Handle page changes - BACKEND handles pagination
  const handlePageChange = (newPage: number) => {
    loadProducts(newPage);
  };

  return (
    <CatalogLayout
      filters={
        <ProductFilters
          availableTags={allTags} // ✅ Now shows ALL tags from entire catalog
          onSortChange={setSortBy}
          onTagFilter={setSelectedTags}
          initialSort={sortBy}
          tagsLoading={tagsLoading} // ✅ Pass loading state
        />
      }
      search={
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search products by name, tags, or description..."
        />
      }
    >
      <ProductGrid 
        products={products} 
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </CatalogLayout>
  );
};

export default CatalogPage;