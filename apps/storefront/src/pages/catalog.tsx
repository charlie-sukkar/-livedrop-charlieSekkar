import React, { useState, useMemo, useEffect } from 'react';
import { listProducts } from '../lib/api';
import type { Product } from '../lib/api';
import { CatalogLayout } from '../components/templates/CatalogLayout';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { SearchBox } from '../components/molecules/SearchBox';
import { ProductFilters } from '../components/organisms/ProductFilters';

type SortOption = 'price-asc' | 'price-desc' | 'name';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await listProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const allTags = useMemo(() => {
    const tags = products.flatMap(product => product.tags);
    return Array.from(new Set(tags)).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query)) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(product =>
        selectedTags.every(tag => product.tags.includes(tag))
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedTags, sortBy]);

  return (
    <CatalogLayout
      filters={
        <ProductFilters
          availableTags={allTags}
          onSortChange={setSortBy}
          onTagFilter={setSelectedTags}
          initialSort={sortBy}
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
      <ProductGrid products={filteredProducts} loading={loading} />
    </CatalogLayout>
  );
};

export default CatalogPage;
