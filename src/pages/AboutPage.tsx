
import { ChevronRight, Star, Wallet, Award, Trophy, Code, PlayCircle, BookOpen, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useWeb3 } from "@/contexts/Web3Context";

const AboutPage = () => {
  const { isConnected, connectWallet } = useWeb3();
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-gradient">
              About InsightQuest
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Learn, earn, and build valuable skills with our Web3 rewards platform
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-brand-dark-darker/70">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
              
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-300">
                  InsightQuest was founded with a simple but powerful mission: to transform learning into an engaging, rewarding experience in the Web3 era. We believe that knowledge acquisition should be incentivized, tracked, and celebrated.
                </p>
              </div>
              
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center shrink-0 mt-1">
                  <Star className="h-6 w-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Incentivized Learning</h3>
                  <p className="text-gray-400">
                    By rewarding users with tokens for completing educational tasks, we create a virtuous cycle that motivates continuous learning and skill development. These tokens represent not just a reward, but the value of insights gained.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center shrink-0 mt-1">
                  <Wallet className="h-6 w-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Web3 Integration</h3>
                  <p className="text-gray-400">
                    We leverage blockchain technology to provide transparent, verifiable records of learning achievements. Your accomplishments are yours to keep, showcasing your growth and dedication to potential employers and collaborators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 hero-gradient">How InsightQuest Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform makes it easy to track learning progress, verify task completion, and earn rewards for your dedication.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-xl p-8 mb-8">
              <ol className="space-y-8">
                <li className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                    <span className="text-brand-purple font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-400 mb-3">
                      Start by connecting your Web3 wallet to our platform. We support MetaMask and other popular wallets, ensuring your rewards are securely stored.
                    </p>
                    {!isConnected && (
                      <Button 
                        onClick={connectWallet} 
                        className="gap-2 purple-gradient"
                      >
                        <Wallet className="h-4 w-4" />
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                </li>
                
                <li className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                    <span className="text-brand-purple font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Add Learning Tasks</h3>
                    <p className="text-gray-400">
                      Create tasks based on your learning goals. Whether it's coding challenges on LeetCode, courses on platforms like Coursera, or educational videos, add them to your dashboard.
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                    <span className="text-brand-purple font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Complete & Verify Tasks</h3>
                    <p className="text-gray-400">
                      After completing a task, mark it as done on your dashboard. Our verification system will confirm your achievement through API integrations with learning platforms.
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                    <span className="text-brand-purple font-medium">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Earn Rewards & Level Up</h3>
                    <p className="text-gray-400">
                      Receive tokens and XP for verified completions. As you accumulate XP, you'll level up on our platform, unlocking additional benefits and recognition.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      
      {/* Task Types Section */}
      <section className="py-16 bg-brand-dark-darker/70">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 hero-gradient">Task Types</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              InsightQuest supports various learning activities to help you build diverse skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-card rounded-lg p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">LeetCode Problems</h3>
              <p className="text-gray-400 mb-4">
                Sharpen your algorithm and data structure skills by completing coding challenges on LeetCode.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Automatic verification through LeetCode API</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Track problems solved over time</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Earn rewards based on problem difficulty</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-card rounded-lg p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Online Courses</h3>
              <p className="text-gray-400 mb-4">
                Complete courses on platforms like Coursera, Udemy, and edX to gain comprehensive knowledge.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Verification through course completion certificates</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Knowledge verification through quizzes</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Higher rewards for accredited courses</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-card rounded-lg p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
                <PlayCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Educational Videos</h3>
              <p className="text-gray-400 mb-4">
                Watch curated videos on topics like productivity, finance, technology, and personal growth.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Verification through comprehension questions</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Short summaries to demonstrate understanding</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-brand-purple" />
                  <span>Quick rewards for bite-sized learning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-xl max-w-4xl mx-auto p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Brain className="w-60 h-60 text-brand-purple" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Join InsightQuest today and transform your learning into rewards.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {isConnected ? (
                      <Button className="purple-gradient" size="lg" asChild>
                        <Link to="/dashboard">
                          Go to Dashboard
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button onClick={connectWallet} className="purple-gradient" size="lg">
                        Connect Wallet
                        <Wallet className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/leaderboard">
                        View Leaderboard
                        <Trophy className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="shrink-0">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark p-[3px] animate-pulse-glow">
                    <div className="w-full h-full rounded-full bg-brand-dark-darker flex items-center justify-center">
                      <Award className="h-20 w-20 text-brand-purple" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
