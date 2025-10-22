import React, { useState } from 'react';
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input';
import { loginCustomer } from '../lib/api';
import { useUser } from '../contexts/UserContext';

export const LoginPage: React.FC = () => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 // In your LoginPage.tsx - remove localStorage calls
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const customer = await loginCustomer(email);
    login(customer); // Just update context - no localStorage
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed.');
  } finally {
    setLoading(false);
  }
};

const handleDemoLogin = async () => {
  setLoading(true);
  setError('');
  
  try {
    const customer = await loginCustomer('demo@example.com');
    login(customer); // Just update context - no localStorage
  } catch (err) {
    setError('Demo account not found.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🛍️ FreshFit</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to access your account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); // Clear error when user types
              }}
              required
              disabled={loading}
              error={error}
              autoComplete="email"
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !email}
                className="w-full"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try a demo</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading Demo...' : 'Try Demo Account'}
              </Button>
              
              <p className="mt-3 text-xs text-gray-500 text-center">
                Demo email: demo@example.com
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>No account needed!</strong> Just enter your email to continue shopping. 
                If you're new, we'll create your account automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};