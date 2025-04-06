
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
  BarChart,
  MessageSquare,
  ChevronDown,
  Settings,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWeb3 } from "@/contexts/Web3Context";
import { shortenAddress, getStageEmoji } from "@/lib/web3Utils";

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
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark purple-glow group-hover:animate-pulse transition-all duration-300">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  IQ
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-purple-dark text-transparent bg-clip-text group-hover:from-brand-purple-dark group-hover:to-brand-purple transition-all duration-300">
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
            
            {isConnected && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${location.pathname === "/dashboard" 
                      ? "bg-brand-purple/20 text-brand-purple" 
                      : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                    }`}
                >
                  <BarChart className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${location.pathname === "/chat" 
                      ? "bg-brand-purple/20 text-brand-purple" 
                      : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                    }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Zappy
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="hidden md:flex items-center gap-2">
                {user?.stage && (
                  <div className="px-2 py-1 rounded-full bg-brand-dark-lighter text-xs font-medium border border-brand-purple/20 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                    <span>{user.stage}</span>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-brand-dark-lighter/50 transition-colors">
                      <Avatar className="h-8 w-8 border border-brand-purple/30 ring-2 ring-brand-purple/10">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback className="bg-brand-dark-lighter text-brand-purple">
                          {user?.username?.[0] || user?.address?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-1">
                          {user?.username || shortenAddress(address || "")}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card border-brand-purple/20">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.username || "User"}</span>
                        <span className="text-xs text-gray-400">{shortenAddress(address || "")}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-brand-purple/10" />
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/chat" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with Zappy</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-brand-purple/10" />
                    <DropdownMenuItem className="cursor-pointer text-red-500" onClick={disconnectWallet}>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Disconnect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    {user?.username?.[0] || user?.address?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user?.username || "User"}</span>
                    {user?.stage && (
                      <span className="px-1.5 py-0.5 rounded-full bg-brand-dark-lighter text-xs border border-brand-purple/20 flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5 text-yellow-400" />
                        {user.stage}
                      </span>
                    )}
                  </div>
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
                <>
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
                  <Link
                    to="/profile"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                      ${location.pathname === "/profile"
                        ? "bg-brand-purple/20 text-brand-purple" 
                        : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                      }`}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <Link
                    to="/chat"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                      ${location.pathname === "/chat"
                        ? "bg-brand-purple/20 text-brand-purple" 
                        : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                      }`}
                  >
                    <MessageSquare className="h-5 w-5" />
                    Chat with Zappy
                  </Link>
                </>
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
