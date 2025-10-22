import React from 'react';
import { CartButton } from '../molecules/CartButton';
import { SupportButton } from '../molecules/SupportButton';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';

interface HeaderProps {
    label: string;
    src: string;
    ShowCartButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ label, src, ShowCartButton = true }) => {
    const { customer, logout } = useUser();
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/admin');
    };

    const goToSupportAssistant = () => {
        navigate('/assistant');
    };

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-8">
                        <a
                            href="/"
                            className="text-xl font-semibold hover:text-blue-600 transition-colors flex items-center gap-3"
                            aria-label="Go back to home page"
                        >
                            <img src={src} alt="Store Logo" className="h-8 w-auto" />
                            <span className="hidden sm:block">{label}</span>
                        </a>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
                                Home
                            </a>

    
                        </nav>
                    </div>

                    {/* Center: User Welcome (only when logged in) */}
                    {customer && (
                        <div className="hidden lg:flex flex-1 justify-center">
                            <div className="bg-blue-50 px-4 py-2 rounded-full">
                                <span className="text-sm text-blue-700 font-medium">
                                    Welcome back, {customer.name}!
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-3">
                        {/* User info and logout */}
                        {customer ? (
                            <div className="hidden sm:flex items-center gap-3 mr-2">
                                <span className="text-sm text-gray-500">
                                    {customer.email}
                                </span>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <button 
                                    onClick={logout}
                                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : null}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {/* Support Assistant Button - Primary CTA */}
                            <Button 
                                onClick={goToSupportAssistant}
                                variant="primary" 
                                size="sm"
                                className="hidden sm:flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Help
                            </Button>

                            {/* Admin Dashboard */}
                            <Button 
                                onClick={goToDashboard} 
                                variant="outline" 
                                size="sm"
                                className="text-sm hidden md:flex"
                            >
                                Dashboard
                            </Button>

                            {/* Mobile Support Button (icon only) */}
                            <button 
                                onClick={goToSupportAssistant}
                                className="sm:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                aria-label="Support Assistant"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </button>

                            {/* Existing components */}
                            <SupportButton />
                            {ShowCartButton && <CartButton />}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t pt-3 pb-2">
                    <nav className="flex justify-around">
                        <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
                            Home
                        </a>
                        <a href="/orders" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
                            Orders
                        </a>

                    </nav>
                </div>
            </div>
        </header>
    );
};