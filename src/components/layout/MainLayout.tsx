
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Wallet, 
  Trophy, 
  Home, 
  Info,
  Menu, 
  X, 
  LogOut, 
  User, 
  BarChart 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useWeb3 } from "@/contexts/Web3Context";
import { shortenAddress } from "@/lib/web3Utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { isConnected, address, user, connectWallet, disconnectWallet } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: "Home", to: "/", icon: Home },
    { name: "Leaderboard", to: "/leaderboard", icon: Trophy },
    { name: "About", to: "/about", icon: Info }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-brand-purple/20 bg-brand-dark-darker/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark purple-glow">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  IQ
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-purple-dark text-transparent bg-clip-text">
                InsightQuest
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? "bg-brand-purple/20 text-brand-purple" 
                      : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex flex-col items-end text-xs">
                  <span className="text-gray-400">Connected</span>
                  <span className="text-brand-purple font-medium">
                    {shortenAddress(address || "")}
                  </span>
                </div>
                <Avatar className="h-8 w-8 border border-brand-purple/30">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-brand-dark-lighter text-brand-purple">
                    {user?.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1 border-brand-purple/30 text-brand-purple hover:bg-brand-purple/20" 
                  onClick={disconnectWallet}
                >
                  <LogOut className="h-3 w-3" />
                  <span>Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button 
                className="gap-1 purple-gradient" 
                size="sm" 
                onClick={connectWallet}
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden md:inline">Connect Wallet</span>
              </Button>
            )}
            
            <button 
              className="block md:hidden p-2 text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-brand-dark-darker/95 pt-16 px-4 md:hidden">
          <div className="flex flex-col gap-3 p-4">
            {isConnected && (
              <div className="flex items-center gap-3 pb-4">
                <Avatar className="h-10 w-10 border border-brand-purple/30">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-brand-dark-lighter text-brand-purple">
                    {user?.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.username || "User"}</span>
                  <span className="text-sm text-gray-400">
                    {shortenAddress(address || "")}
                  </span>
                </div>
              </div>
            )}
            
            <Separator className="bg-brand-purple/20" />
            
            {/* Navigation links */}
            <nav className="flex flex-col gap-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                      ${isActive 
                        ? "bg-brand-purple/20 text-brand-purple" 
                        : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              
              {isConnected && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                    ${location.pathname === "/dashboard"
                      ? "bg-brand-purple/20 text-brand-purple" 
                      : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                    }`}
                >
                  <BarChart className="h-5 w-5" />
                  Dashboard
                </Link>
              )}
            </nav>
            
            <Separator className="bg-brand-purple/20" />
            
            {/* Auth buttons */}
            <div className="py-4">
              {isConnected ? (
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-brand-purple/30 text-brand-purple hover:bg-brand-purple/20" 
                  onClick={disconnectWallet}
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect Wallet
                </Button>
              ) : (
                <Button 
                  className="w-full gap-2 purple-gradient" 
                  onClick={connectWallet}
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-purple/20 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark flex items-center justify-center text-white text-xs font-bold">
              IQ
            </div>
            <span className="text-sm font-medium text-gray-400">
              InsightQuest © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-400 hover:text-brand-purple transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-brand-purple transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-brand-purple transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
