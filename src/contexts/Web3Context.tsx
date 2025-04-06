
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { getConnectedAddress, setConnectedAddress, getCurrentUser, initializeUser } from '../lib/mockData';
import { User } from '../types';

interface Web3ContextType {
  isConnected: boolean;
  connecting: boolean;
  address: string | null;
  user: User | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshUser: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  connecting: false,
  address: null,
  user: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshUser: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const checkConnection = async () => {
    const savedAddress = getConnectedAddress();
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
      const user = getCurrentUser();
      setUser(user);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      
      // Check if Metamask is installed
      if (typeof window.ethereum === 'undefined') {
        toast.error('Metamask not installed', {
          description: 'Please install Metamask to continue'
        });
        return;
      }
      
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      
      // Success!
      setAddress(userAddress);
      setConnectedAddress(userAddress);
      setIsConnected(true);
      
      // Get or create user
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = initializeUser(userAddress);
      }
      setUser(currentUser);
      
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet', {
        description: 'Please try again or use a different wallet'
      });
    } finally {
      setConnecting(false);
    }
  };
  
  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setUser(null);
    localStorage.removeItem('connectedAddress');
    toast.info('Wallet disconnected');
  };
  
  const refreshUser = () => {
    if (address) {
      const refreshedUser = getCurrentUser();
      setUser(refreshedUser);
    }
  };
  
  return (
    <Web3Context.Provider 
      value={{ 
        isConnected, 
        connecting, 
        address, 
        user,
        connectWallet, 
        disconnectWallet,
        refreshUser
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Add TypeScript interface for Ethereum window object
declare global {
  interface Window {
    ethereum: any;
  }
}
