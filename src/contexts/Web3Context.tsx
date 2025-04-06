
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { getConnectedAddress, setConnectedAddress, getCurrentUser, initializeUser } from '../lib/mockData';
import { User } from '../types';
import { getUserStage, getStageEmoji } from '../lib/web3Utils';

interface Web3ContextType {
  isConnected: boolean;
  connecting: boolean;
  address: string | null;
  user: User | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshUser: () => void;
  updateUsername: (username: string) => void;
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  connecting: false,
  address: null,
  user: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshUser: () => {},
  updateUsername: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [dailyLoginChecked, setDailyLoginChecked] = useState<boolean>(false);

  const checkDailyLogin = (currentUser: User) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = currentUser.lastLogin;
    
    if (lastLogin !== today) {
      // Award daily XP (100 XP)
      const updatedUser = {
        ...currentUser,
        xp: currentUser.xp + 100,
        lastLogin: today
      };
      
      // Update user in local storage (mock)
      localStorage.setItem(`user_${updatedUser.address}`, JSON.stringify(updatedUser));
      
      // Show toast notification
      toast.success(`Daily Login Reward! +100 XP`, {
        description: `Welcome back! You've earned 100 XP for logging in today.`,
        duration: 5000,
      });
      
      return updatedUser;
    }
    
    return currentUser;
  };

  const checkConnection = async () => {
    const savedAddress = getConnectedAddress();
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
      let currentUser = getCurrentUser();
      
      // Set stage based on level
      currentUser = {
        ...currentUser,
        stage: getUserStage(currentUser.level)
      };
      
      // Check for daily login if not already checked
      if (!dailyLoginChecked) {
        currentUser = checkDailyLogin(currentUser);
        setDailyLoginChecked(true);
      }
      
      setUser(currentUser);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);
  
  const updateUsername = (username: string) => {
    if (!address || !user) return;
    
    const updatedUser = {
      ...user,
      username
    };
    
    // Update user in local storage (mock)
    localStorage.setItem(`user_${address}`, JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast.success('Username updated successfully!');
  };

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
      
      // Set stage based on level
      currentUser = {
        ...currentUser,
        stage: getUserStage(currentUser.level)
      };
      
      // Check for saved username
      const savedUsername = localStorage.getItem(`username_${userAddress}`);
      if (savedUsername && !currentUser.username) {
        currentUser.username = savedUsername;
        localStorage.setItem(`user_${userAddress}`, JSON.stringify(currentUser));
      }
      
      setUser(currentUser);
      
      // Show welcome back toast with stage info if returning user
      if (localStorage.getItem(`user_${userAddress}`)) {
        const emoji = getStageEmoji(currentUser.stage);
        toast.success(`Welcome back to InsightQuest!`, {
          description: `You're currently at the ${emoji} ${currentUser.stage} stage. Keep going!`
        });
        
        // Check daily login reward after a short delay
        setTimeout(() => {
          const updatedUser = checkDailyLogin(currentUser);
          if (updatedUser !== currentUser) {
            setUser(updatedUser);
          }
          setDailyLoginChecked(true);
        }, 1500);
      } else {
        toast.success('Wallet connected successfully!');
      }
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
      let refreshedUser = getCurrentUser();
      
      // Set stage based on level
      refreshedUser = {
        ...refreshedUser,
        stage: getUserStage(refreshedUser.level)
      };
      
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
        refreshUser,
        updateUsername
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
