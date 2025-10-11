import React from 'react';
import { CartButton } from '../molecules/CartButton';
import { SupportButton } from '../molecules/SupportButton';

interface HeaderProps {
    label: string;
    src: string;
    ShowCartButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ label, src, ShowCartButton = true }) => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a
                        href="/"
                        className="text-xl font-semibold hover:text-blue-600 transition-colors"
                        aria-label="Go back to home page"
                    >
                        <img src={src} alt="Store Logo" className="h-8 w-auto inline-block ml-2" />
                        {label}
                    </a>

                    <div className="flex items-center space-x-2">
                        <SupportButton /> 
                        {ShowCartButton && <CartButton />}
                    </div>
                </div>
            </div>
        </header>
    );
};