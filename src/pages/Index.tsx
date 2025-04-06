
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Award, Brain, Code, Play, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useWeb3 } from "@/contexts/Web3Context";
import { generateMockLeaderboard } from "@/lib/mockData";

const Index = () => {
  const { isConnected, connectWallet } = useWeb3();
  const navigate = useNavigate();
  
  // If already connected, redirect to dashboard
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);
  
  const leaderboard = generateMockLeaderboard().slice(0, 5);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.15)_0,transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-gradient">
                Earn Rewards While Building Skills
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Complete learning challenges, solve problems, and watch educational content to earn tokens and insights. Track your progress and climb the leaderboard!
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={connectWallet} 
                  size="lg"
                  className="purple-gradient"
                >
                  Connect Wallet to Start
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full border-2 border-brand-dark-darker overflow-hidden"
                    >
                      <img 
                        src={`https://api.dicebear.com/6.x/avataaars/svg?seed=user${i}`} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Join <span className="text-brand-purple font-medium">1,000+</span> users already earning rewards
                </p>
              </div>
            </div>
            
            <div className="lg:w-2/5">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple to-brand-purple-dark rounded-lg blur opacity-30"></div>
                <div className="glass-card rounded-lg p-6 relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Top Earners</h3>
                    <Link to="/leaderboard" className="text-sm text-brand-purple flex items-center gap-1">
                      View All
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {leaderboard.map((entry, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-4 p-3 rounded-md bg-brand-dark-lighter/30"
                      >
                        <div className="w-6 h-6 flex items-center justify-center font-medium text-sm">
                          {index + 1}
                        </div>
                        
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img 
                            src={entry.avatarUrl || `https://api.dicebear.com/6.x/avataaars/svg?seed=${entry.address}`} 
                            alt={entry.username} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium truncate">{entry.username || `user${index + 1}`}</div>
                          <div className="text-xs text-gray-400">Level {entry.level}</div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Award className="h-4 w-4" />
                          <span className="font-bold">{entry.tokensEarned}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-brand-dark-darker/70">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 hero-gradient">
              How InsightQuest Works
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Complete tasks, earn tokens, and gain valuable insights through a variety of learning activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Code className="h-6 w-6 text-brand-purple" />}
              title="Solve Coding Challenges"
              description="Complete LeetCode problems and challenges to earn tokens and improve your algorithm skills"
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-brand-purple" />}
              title="Complete Courses"
              description="Finish modules on platforms like Coursera and earn rewards for your dedication to learning"
            />
            <FeatureCard 
              icon={<Play className="h-6 w-6 text-brand-purple" />}
              title="Watch Educational Videos"
              description="Earn by watching curated videos on productivity, finance, technology, and more"
            />
            <FeatureCard 
              icon={<Trophy className="h-6 w-6 text-brand-purple" />}
              title="Climb the Leaderboard"
              description="Compete with others and track your progress as you earn more tokens"
            />
            <FeatureCard 
              icon={<Brain className="h-6 w-6 text-brand-purple" />}
              title="Build Real Skills"
              description="Tasks are designed to provide valuable insights and practical knowledge"
            />
            <FeatureCard 
              icon={<Award className="h-6 w-6 text-brand-purple" />}
              title="Earn Real Rewards"
              description="Exchange tokens for real-world benefits, discounts, and more"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 to-transparent" />
            <div className="relative z-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Earning While Learning?
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Connect your wallet now and start completing tasks to earn tokens and climb the leaderboard.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={connectWallet} size="lg" className="purple-gradient">
                    Connect Wallet
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/leaderboard">
                      View Leaderboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="glass-card rounded-lg p-6 card-hover">
      <div className="h-12 w-12 rounded-lg bg-brand-purple/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default Index;
