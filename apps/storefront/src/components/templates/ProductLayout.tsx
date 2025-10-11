import React from 'react';
import { Header } from '../organisms/Header';


interface ProductLayoutProps {
  children: React.ReactNode;
  relatedProducts: React.ReactNode;
}

export const ProductLayout: React.FC<ProductLayoutProps> = ({
  children,
  relatedProducts
}) => {
  return (
    <div className="min-h-screen bg-gray-50">

    <Header label='Fresh-Fit' src='/public/logo.svg'/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {children}
        
        {relatedProducts}
      </main>
    </div>
  );
};