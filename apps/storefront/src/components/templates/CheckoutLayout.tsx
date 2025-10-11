import React from 'react';
import { Header } from '../organisms/Header';

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
       <Header label='Fresh-Fit' src='/public/logo.svg' ShowCartButton={false}/>

      <main>
        {children}
      </main>
    </div>
  );
};