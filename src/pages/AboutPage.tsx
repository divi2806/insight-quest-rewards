
import { useState } from "react";
import { ChevronRight, Star, Wallet, Award, Trophy, Code, PlayCircle, BookOpen, Brain, Zap, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useWeb3 } from "@/contexts/Web3Context";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Card,
  CardContent
} from "@/components/ui/card";

const AboutPage = () => {
  const { isConnected, connectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState<'overview' | 'tokenomics' | 'faq'>('overview');
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/30 to-brand-dark-darker/90 z-0"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-brand-purple-light/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-brand-purple/10 rounded-full border border-brand-purple/20">
              <span className="text-brand-purple font-medium text-sm">Learn • Earn • Grow</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About <span className="hero-gradient">InsightQuest</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10">
              Your gamified learning journey with blockchain-verified achievements and real rewards
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="purple-gradient" size="lg" asChild>
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#mission">
                  Learn More
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-8 justify-center">
            <button 
              className={`py-4 px-2 relative font-medium ${activeTab === 'overview' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('overview')}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
              )}
            </button>
            <button 
              className={`py-4 px-2 relative font-medium ${activeTab === 'tokenomics' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('tokenomics')}
            >
              Tokenomics
              {activeTab === 'tokenomics' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
              )}
            </button>
            <button 
              className={`py-4 px-2 relative font-medium ${activeTab === 'faq' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'}`} 
              onClick={() => setActiveTab('faq')}
            >
              FAQ
              {activeTab === 'faq' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
              )}
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'overview' && (
        <>
          {/* Mission Section */}
          <section className="py-16 bg-brand-dark-darker/70" id="mission">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="glass-card rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
                  
                  <div className="mb-8">
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
                  
                  <div className="flex items-start gap-4 mb-8">
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

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center shrink-0 mt-1">
                      <Brain className="h-6 w-6 text-brand-purple" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">AI-Powered Features</h3>
                      <p className="text-gray-400">
                        Our platform leverages AI to verify task completion, provide personalized learning recommendations, and offer assistance through Zappy, our AI assistant that helps you brainstorm and stay focused.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Tech Stack */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Our Technology Stack</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Built with powerful modern technologies for a secure, scalable experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <Card className="bg-transparent border-gray-800 hover:border-brand-purple/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-blue-500"><path fill="currentColor" d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Frontend</h3>
                    <p className="text-gray-400 mb-4">
                      Built with React and Vite for a lightning-fast, responsive user experience
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-gray-800 hover:border-brand-purple/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-green-500"><path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2.218 18.616c-.354.069-.468-.149-.468-.336v-1.921c0-.653-.229-1.079-.481-1.296 1.56-.173 3.198-.765 3.198-3.454 0-.765-.273-1.389-.723-1.878.072-.177.314-.889-.069-1.853 0 0-.587-.188-1.923.717a6.78 6.78 0 0 0-1.752-.236 6.73 6.73 0 0 0-1.752.236c-1.336-.905-1.923-.717-1.923-.717-.385.964-.141 1.676-.069 1.853-.45.489-.722 1.113-.722 1.878 0 2.682 1.634 3.282 3.189 3.459-.2.175-.381.483-.443.936-.398.179-1.413.488-2.037-.582 0 0-.37-.672-1.073-.722 0 0-.683-.009-.048.426 0 0 .46.215.777 1.024 0 0 .405 1.25 2.353.826v1.303c0 .185-.113.402-.462.337A6.996 6.996 0 0 1 5 12.007a7.001 7.001 0 0 1 7-7 7 7 0 0 1 7 7 6.992 6.992 0 0 1-4.782 6.609z"/></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Backend</h3>
                    <p className="text-gray-400 mb-4">
                      Node.js backend with Firebase for database and storage solutions
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-gray-800 hover:border-brand-purple/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                      <svg viewBox="0 0 72 72" className="h-7 w-7 text-purple-500"><path fill="currentColor" d="m36 54.14 15.079-9.394 2.82 4.527-17.899 11.153-17.899-11.153 2.82-4.527L36 54.14ZM5.033 34.848l2.82-4.527 28.147 17.541 28.147-17.541 2.82 4.527L36 53.52 5.033 34.848ZM36 13.348l17.899 11.153-2.82 4.527L36 19.634l-15.079 9.394-2.82-4.527L36 13.348Z"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Blockchain</h3>
                    <p className="text-gray-400 mb-4">
                      Ethereum-based with ethers.js for Web3 interaction and Solidity smart contracts
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-gray-800 hover:border-brand-purple/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-orange-500"><path fill="currentColor" d="M3.888 3.236a1.162 1.162 0 0 1 1.39-.4l.38.115 14.076 4.437a1.195 1.195 0 0 1 .787 1.135v.045l-.007 7.178c0 .369-.117.714-.333 1.003l-.148.183-5.618 6.78a1.16 1.16 0 0 1-1.447.276l-.114-.076-5.866-4.595a1.208 1.208 0 0 1-.393-.496l-.052-.126-3.047-8.146a1.206 1.206 0 0 1 .058-.96l.092-.167 3.598-4.155a1.155 1.155 0 0 1 .642-.363Zm14.806 5.192-13.31-4.196-3.218 3.72 2.904 7.76 5.552 4.35 5.211-6.286a.154.154 0 0 0 .04-.112l.007-.032V8.428ZM15.39 19.14l3-3 3 3-3 3-3-3Zm1.06-1.06-3-3 1.06-1.06 3 3-1.06 1.06Zm3.88-3.88-3-3 1.06-1.06 3 3-1.06 1.06Zm-2.82.94 1.88 1.88-1.06 1.06-1.88-1.88 1.06-1.06Z"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Authentication</h3>
                    <p className="text-gray-400 mb-4">
                      Web3 authentication with MetaMask for secure wallet-based identity verification
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="py-16 bg-brand-dark-darker/70">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3 hero-gradient">How InsightQuest Works</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Our platform makes it easy to track learning progress, verify task completion, and earn rewards for your dedication
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
                          After completing a task, mark it as done on your dashboard. Our verification system will confirm your achievement through API integrations or AI-based verification.
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
          <section className="py-16">
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
        </>
      )}
      
      {activeTab === 'tokenomics' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass-card rounded-xl p-8 mb-8">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-brand-purple" />
                    </div>
                    <h2 className="text-2xl font-bold">$TASK Token Overview</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Token Name</span>
                        <span className="font-medium">$TASK</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Type</span>
                        <span className="font-medium">ERC-20</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Total Supply</span>
                        <span className="font-medium">1,000,000,000 (1B)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Unlock Duration</span>
                        <span className="font-medium">3 years</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Network</span>
                        <span className="font-medium">Sepolia / Ethereum (Later)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Initial Distribution</span>
                        <span className="font-medium">Free to users via tasks (Testnet)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Live Launch</span>
                        <span className="font-medium">After critical mass → go Mainnet</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Token Allocation Breakdown</h3>
                <div className="overflow-x-auto mb-8">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">% of Supply</th>
                        <th className="py-3 px-4 text-left">Tokens</th>
                        <th className="py-3 px-4 text-left">Unlock Schedule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      <tr>
                        <td className="py-3 px-4">🔄 User Rewards (REWARD POOL)</td>
                        <td className="py-3 px-4">45%</td>
                        <td className="py-3 px-4">450M</td>
                        <td className="py-3 px-4">Linear over 3 years</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">📈 Ecosystem Growth</td>
                        <td className="py-3 px-4">20%</td>
                        <td className="py-3 px-4">200M</td>
                        <td className="py-3 px-4">Vesting + DAO-controlled</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">👨‍💻 Team & Founders (TREASURY)</td>
                        <td className="py-3 px-4">15%</td>
                        <td className="py-3 px-4">150M</td>
                        <td className="py-3 px-4">1-year cliff + 3-year vesting</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">🤝 Investors / Strategic</td>
                        <td className="py-3 px-4">10%</td>
                        <td className="py-3 px-4">100M</td>
                        <td className="py-3 px-4">Strategic rounds only</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">🎁 Community (airdrops)</td>
                        <td className="py-3 px-4">5%</td>
                        <td className="py-3 px-4">50M</td>
                        <td className="py-3 px-4">First 6–12 months</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">🏦 Treasury & DAO Ops</td>
                        <td className="py-3 px-4">5%</td>
                        <td className="py-3 px-4">50M</td>
                        <td className="py-3 px-4">Controlled by DAO</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Token Utility</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Use AI Agents for productivity and learning assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Stake tokens to earn passive income through revenue sharing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Participate in governance through DAO voting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Access premium features and boost learning rewards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Develop and monetize AI Agents in the marketplace</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Revenue Model</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>2.5-5% fee from AI Agent marketplace transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Brand sponsorships for challenges and tournaments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>API licensing for companies to implement reward systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Premium subscription features for advanced analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {activeTab === 'faq' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="glass-card rounded-xl overflow-hidden p-1">
                <AccordionItem value="item-1" className="border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                    <span className="text-lg">What is InsightQuest?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                    InsightQuest is a gamified productivity platform that rewards users with $TASK tokens for completing tasks that benefit them, such as solving LeetCode problems or watching educational content. We're combining learning with blockchain technology to create verifiable achievements and real rewards.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                    <span className="text-lg">How do you verify completed tasks?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                    We use two verification methods: (1) API integrations with platforms like LeetCode to automatically verify completion, and (2) a community-based verification system where users can earn karma and tokens by verifying other users' tasks. We're also developing AI-based verification for image, PDF, and text proof submissions.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                    <span className="text-lg">What can I do with $TASK tokens?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                    $TASK tokens have multiple utilities: (1) Purchase AI services like image verification or streak boosts, (2) Access the AI Agent marketplace, (3) Stake tokens to earn passive income, (4) Participate in governance through DAO voting, and (5) Develop and monetize your own AI agents on our platform.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                    <span className="text-lg">Why would anyone invest in $TASK?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                    Investors benefit from: (1) Early token acquisition before broader adoption, (2) Consistent buyback by the team to maintain token value, (3) Required token usage for premium features, (4) Staking rewards with 8-10% APR, (5) Revenue from brand sponsorships and API licensing, and (6) Percentage fees from the AI Agent marketplace.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                    <span className="text-lg">What is the AI Agent Marketplace?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                    The AI Agent Marketplace is a platform where users can buy task-specific AI agents to enhance productivity. Developers can contribute their agents and earn 97.5% of the payment in $TASK tokens, with 2.5% going to platform fees. It's similar to Hugging Face but with a focus on productivity and financial incentives.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                    <span className="text-lg">How is InsightQuest financially sustainable?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                    We generate revenue through multiple channels: (1) 2.5-5% fee from AI Agent marketplace transactions, (2) Staking fees, (3) Brand sponsorship for contests and challenges, (4) API licensing for corporate integration, (5) Subscription fees for premium features, and (6) DAO treasury management of platform resources.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7" className="border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                    <span className="text-lg">Why is the platform DAO-governed?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                    DAO governance gives users ownership and voting rights in the platform. It allows community members to propose and vote on changes, ensures transparency through blockchain verification, and creates a sense of ownership that drives engagement. Think of it like investing early in Duolingo, but with community governance and direct token benefits instead of ads.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      )}
      
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
