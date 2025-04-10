import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { getConnectedAddress, setConnectedAddress, getCurrentUser, initializeUser } from '../lib/mockData';
import { User } from '../types';
import { getUserStage, getStageEmoji } from '../lib/web3Utils';
import { saveUser, getUser } from '@/services/firebase';

// Sepolia chain info
const SEPOLIA_CHAIN_ID = '0xaa36a7';  // Hex value for Sepolia testnet (11155111 in decimal)
const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

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

  // Check if the user is on the correct network
  const checkAndSwitchNetwork = async () => {
    if (!window.ethereum) return false;
    
    try {
      // Get the current chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // If not on Sepolia, switch
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          return true;
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: SEPOLIA_CHAIN_ID,
                    chainName: 'Sepolia Testnet',
                    rpcUrls: [SEPOLIA_RPC_URL],
                    nativeCurrency: {
                      name: 'Sepolia ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                  },
                ],
              });
              return true;
            } catch (addError) {
              console.error('Error adding Sepolia network:', addError);
              return false;
            }
          }
          console.error('Error switching to Sepolia network:', switchError);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  // Listen for network changes
  useEffect(() => {
    if (!window.ethereum) return;
    
    const handleChainChanged = async (chainId: string) => {
      if (chainId !== SEPOLIA_CHAIN_ID && isConnected) {
        toast.warning('Network Change Detected', {
          description: 'Please use Sepolia Testnet for InsightQuest',
          action: {
            label: 'Switch Back',
            onClick: checkAndSwitchNetwork,
          },
          duration: 0, // Keep toast visible until dismissed
        });
      }
    };
    
    window.ethereum.on('chainChanged', handleChainChanged);
    
    // Clean up listener on unmount
    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [isConnected]);

  const checkDailyLogin = async (currentUser: User) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = currentUser.lastLogin;
    
    // Initialize streak if not present
    if (!currentUser.loginStreak) {
      currentUser.loginStreak = 0;
    }
    
    if (lastLogin !== today) {
      // Check if streak should continue or reset
      let streak = currentUser.loginStreak || 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // If last login was yesterday, increment streak
      if (lastLogin === yesterdayStr) {
        streak += 1;
      } 
      // If last login was more than a day ago, reset streak
      else if (lastLogin) {
        streak = 1; // Reset but count today
      } 
      // First time login
      else {
        streak = 1;
      }
      
      // Calculate XP bonus based on streak
      let xpReward = 100; // Base XP reward
      let streakBonus = 0;
      
      if (streak >= 7) {
        streakBonus = 100; // 7+ days streak
      } else if (streak >= 3) {
        streakBonus = 50; // 3-6 days streak
      }
      
      const totalXp = xpReward + streakBonus;
      
      // Update user with new XP and streak info
      const updatedUser = {
        ...currentUser,
        xp: currentUser.xp + totalXp,
        lastLogin: today,
        loginStreak: streak
      };
      
      // Update user in Firebase
      await saveUser(updatedUser);
      
      // Update user in local storage as backup
      localStorage.setItem(`user_${updatedUser.address}`, JSON.stringify(updatedUser));
      
      // Show toast notification with appropriate message
      if (streak > 1) {
        toast.success(`${streak}-Day Streak! +${totalXp} XP`, {
          description: `You've logged in ${streak} days in a row! Keep it up for more rewards.`,
          duration: 5000,
        });
      } else {
        toast.success(`Daily Login Reward! +${totalXp} XP`, {
          description: `Welcome back! You've earned ${totalXp} XP for logging in today.`,
          duration: 5000,
        });
      }
      
      return updatedUser;
    }
    
    return currentUser;
  };

  const checkConnection = async () => {
    const savedAddress = getConnectedAddress();
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
      
      // Try to get user from Firebase first
      let fbUser = await getUser(savedAddress);
      
      // If not found in Firebase, fall back to local storage
      if (!fbUser) {
        let currentUser = getCurrentUser();
        
        // Save user to Firebase for future use
        if (currentUser) {
          await saveUser(currentUser);
          fbUser = currentUser;
        }
      }
      
      if (fbUser) {
        // Set stage based on level
        fbUser = {
          ...fbUser,
          stage: getUserStage(fbUser.level)
        };
        
        // Check for daily login if not already checked
        if (!dailyLoginChecked) {
          fbUser = await checkDailyLogin(fbUser);
          setDailyLoginChecked(true);
        }
        
        setUser(fbUser);
      }
      
      // Ensure correct network
      await checkAndSwitchNetwork();
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);
  
  const updateUsername = async (username: string) => {
    if (!address || !user) return;
    
    const updatedUser = {
      ...user,
      username
    };
    
    // Update user in Firebase
    const success = await saveUser(updatedUser);
    
    if (success) {
      // Update user in local storage as backup
      localStorage.setItem(`user_${address}`, JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Username updated successfully!');
    } else {
      toast.error('Failed to update username');
    }
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
      
      // Check and switch to Sepolia network first
      const networkSwitched = await checkAndSwitchNetwork();
      if (!networkSwitched) {
        toast.error('Network Switch Failed', {
          description: 'Please manually switch to Sepolia Testnet to continue'
        });
        setConnecting(false);
        return;
      }
      
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      
      // Success!
      setAddress(userAddress);
      setConnectedAddress(userAddress);
      setIsConnected(true);
      
      // Try to get user from Firebase first
      let fbUser = await getUser(userAddress);
      let isNewUser = false;
      
      // If not found in Firebase, check local storage or create new
      if (!fbUser) {
        let currentUser = getCurrentUser();
        
        if (!currentUser) {
          currentUser = initializeUser(userAddress);
          isNewUser = true;
        }
        
        // Save to Firebase
        await saveUser(currentUser);
        fbUser = currentUser;
      }
      
      // Set stage based on level
      fbUser = {
        ...fbUser,
        stage: getUserStage(fbUser.level)
      };
      
      // Check for saved username
      const savedUsername = localStorage.getItem(`username_${userAddress}`);
      if (savedUsername && !fbUser.username) {
        fbUser.username = savedUsername;
        await saveUser(fbUser);
      }
      
      // Generate a random avatar for the user if they don't have one already
      if (!fbUser.avatarUrl) {
        // Generate a unique seed based on the user's address to ensure consistency
        const seed = fbUser.address.slice(2, 10); // Use part of the address as seed
        fbUser.avatarUrl = `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
        await saveUser(fbUser);
      }
      
      setUser(fbUser);
      
      // Show welcome back toast with stage info if returning user
      if (!isNewUser) {
        const emoji = getStageEmoji(fbUser.stage);
        toast.success(`Welcome back to InsightQuest!`, {
          description: `You're currently at the ${emoji} ${fbUser.stage} stage. Keep going!`
        });
        
        // Check daily login reward after a short delay
        setTimeout(async () => {
          const updatedUser = await checkDailyLogin(fbUser);
          if (updatedUser !== fbUser) {
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
  
  const refreshUser = async () => {
    if (address) {
      // Try to get fresh user data from Firebase
      let refreshedUser = await getUser(address);
      
      // If not found in Firebase, fall back to local storage
      if (!refreshedUser) {
        refreshedUser = getCurrentUser();
        
        // Save to Firebase for future use
        if (refreshedUser) {
          await saveUser(refreshedUser);
        }
      }
      
      if (refreshedUser) {
        // Set stage based on level
        refreshedUser = {
          ...refreshedUser,
          stage: getUserStage(refreshedUser.level)
        };
        
        setUser(refreshedUser);
      }
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
