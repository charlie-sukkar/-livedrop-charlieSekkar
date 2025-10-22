
import React, { createContext, useContext, useState } from 'react';
import type { Customer } from '../lib/api'; 

interface UserContextType {
  customer: Customer | null;
  login: (customer: Customer) => void;
  logout: () => void;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading ] = useState(false); 


  const login = (customer: Customer) => {
    setCustomer(customer); 
  };

  const logout = () => {
    setCustomer(null); 
  };

  return (
    <UserContext.Provider value={{ customer, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

