import React from 'react';
import { Header } from '../organisms/Header';

interface CatalogLayoutProps {
  children: React.ReactNode;
  filters: React.ReactNode;
  search: React.ReactNode;
}

export const CatalogLayout: React.FC<CatalogLayoutProps> = ({
  children,
  filters,
  search
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header label='Fresh-Fit' src='/public/logo.svg'/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8 space-y-4">
          {search}
          {filters}
        </div>

        {children}
      </main>
    </div>
  );
};