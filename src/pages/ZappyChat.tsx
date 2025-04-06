
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, User as UserIcon, RefreshCw, Award } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import MainLayout from "@/components/layout/MainLayout";
import { useWeb3 } from "@/contexts/Web3Context";

// Predefined responses for Zappy
const zappyResponses = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    responses: [
      "Hello there, fellow learner! How's your quest for insights going today? 🌟",
      "Hey! Ready to tackle some challenges and earn rewards? I'm here to help! ✨",
      "Hi there! Looking to level up your skills and earn some tokens today? Let's do it! 💪"
    ]
  },
  {
    keywords: ["how are you", "how's it going", "how are things"],
    responses: [
      "I'm buzzing with energy and ready to help! How can I assist you on your learning journey? ⚡",
      "I'm operating at 100% motivation levels! How about you? Ready to learn something awesome? 🔥",
      "I'm fantastic! Always excited to chat with someone on the path to growth and learning! 🚀"
    ]
  },
  {
    keywords: ["help", "assist", "guidance", "support"],
    responses: [
      "I'm your Web3 buddy, here to motivate and guide you! Need help with tasks, learning strategies, or just want a motivation boost? I'm your bot! 🤖💫",
      "Need some guidance? I can help with task suggestions, learning tips, or just a friendly push when you need it! What area are you focusing on? 📚",
      "I'm here to support your learning journey! Whether it's coding challenges, course recommendations, or productivity tips, just ask away! 🧠"
    ]
  },
  {
    keywords: ["task", "tasks", "challenge", "challenges", "assignment"],
    responses: [
      "Tasks are your pathway to rewards! Complete them consistently to level up faster. What kind of tasks are you working on currently? 📝",
      "The best way to approach tasks is to set a daily goal. Even small progress adds up to big rewards over time! Need some task ideas? 🎯",
      "Try mixing up different types of tasks - some coding, some video learning, some courses. It keeps things interesting and builds well-rounded skills! 🔄"
    ]
  },
  {
    keywords: ["leetcode", "coding", "code", "algorithm", "programming"],
    responses: [
      "LeetCode is a fantastic way to sharpen your coding skills! Start with easy problems and work your way up. Consistency is key! 💻",
      "When tackling coding challenges, remember to understand the problem first, then plan your approach before jumping into code. It saves time! 🧩",
      "Try to solve at least one coding problem daily. It's like exercise for your brain and will help you level up faster in InsightQuest! 🏆"
    ]
  },
  {
    keywords: ["course", "learn", "learning", "study", "education"],
    responses: [
      "Courses are a great way to gain structured knowledge! Break them into smaller chunks to make progress consistently. What are you learning about? 📚",
      "The key to completing courses is setting aside dedicated time each day. Even 25-minute focused sessions can lead to great progress! ⏱️",
      "Taking notes while watching course videos helps retention. Plus, you can earn rewards for both watching AND understanding the material! 📝"
    ]
  },
  {
    keywords: ["video", "watch", "youtube", "content"],
    responses: [
      "Educational videos are perfect for visual learners! They also count as tasks in InsightQuest, so keep learning and earning! 🎥",
      "Try the Pomodoro technique when watching educational content - 25 minutes of focused watching, then a 5-minute break. Works wonders! ⏰",
      "After watching educational videos, try to explain what you learned in your own words. It reinforces the knowledge and helps you earn those verification rewards! 🧠"
    ]
  },
  {
    keywords: ["token", "tokens", "reward", "rewards", "earn"],
    responses: [
      "Tokens in InsightQuest represent your learning achievements! The more you learn and verify, the more you earn. Keep going! 🪙",
      "Your token earnings reflect your dedication to learning. Each one is a badge of honor showing your commitment to self-improvement! 💰",
      "Tokens aren't just numbers - they represent real value in terms of the knowledge and skills you've gained. That's the true reward! 💎"
    ]
  },
  {
    keywords: ["motivation", "motivate", "inspire", "encouragement", "stuck"],
    responses: [
      "Remember why you started this journey! Every small step builds toward your bigger goals. You've got this! 💪",
      "When motivation dips, focus on how far you've come rather than how far you have to go. Progress, not perfection! 🌱",
      "Try the 5-minute rule: when you don't feel like working on a task, just do it for 5 minutes. Often, you'll find momentum and continue! ⏳"
    ]
  },
  {
    keywords: ["tip", "tips", "advice", "strategy", "strategies"],
    responses: [
      "Here's a productivity tip: batch similar tasks together. Your brain works more efficiently when it's not constantly switching contexts! 🧠",
      "Try the 2-minute rule: if a task takes less than 2 minutes, do it immediately rather than scheduling it for later. Small wins add up! ⚡",
      "Celebrate your achievements, no matter how small! Acknowledging progress releases dopamine and motivates you to keep going! 🎉"
    ]
  },
  {
    keywords: ["thank", "thanks", "appreciate", "grateful"],
    responses: [
      "You're very welcome! It's my pleasure to help you on your learning journey! Keep up the great work! 😊",
      "Anytime! That's what I'm here for. Keep crushing those tasks and reaching new levels! 🚀",
      "No problem at all! Remember, I'm always here when you need a motivational boost or friendly advice! 💫"
    ]
  }
];

// Default responses when no keywords match
const defaultResponses = [
  "I'm here to help you stay motivated and productive! What are you working on today? 🌟",
  "Remember, consistency is key to learning! Even small steps count toward big progress. 🚀",
  "Need any advice on managing your tasks or learning more effectively? I'm full of tips! 💡",
  "The journey of learning is as valuable as the destination. Enjoy the process! 🌈",
  "Every task completed is a step toward mastery. Keep going, you're doing great! 🔥"
];

interface Message {
  id: string;
  sender: "user" | "zappy";
  content: string;
  timestamp: Date;
}

const ZappyChat = () => {
  const navigate = useNavigate();
  const { isConnected, user } = useWeb3();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // If not connected, redirect to home
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    } else {
      // Add welcome message
      setMessages([
        {
          id: "welcome",
          sender: "zappy",
          content: `Hey there${user?.username ? `, ${user.username}` : ""}! I'm Zappy, your Web3 learning buddy! 👋 I'm here to keep you motivated, answer questions, and help you make the most of InsightQuest. What can I help you with today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isConnected, navigate, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const generateResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for keywords matches
    for (const category of zappyResponses) {
      for (const keyword of category.keywords) {
        if (lowerCaseMessage.includes(keyword)) {
          const randomIndex = Math.floor(Math.random() * category.responses.length);
          return category.responses[randomIndex];
        }
      }
    }
    
    // Return default response if no keywords match
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    return defaultResponses[randomIndex];
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate thinking
    setThinking(true);
    
    // Generate response after a delay
    setTimeout(() => {
      const responseContent = generateResponse(input);
      
      const zappyMessage: Message = {
        id: `zappy-${Date.now()}`,
        sender: "zappy",
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, zappyMessage]);
      setThinking(false);
      
      // Random chance to award a small token
      if (Math.random() < 0.1) {
        setTimeout(() => {
          toast({
            title: "Engagement Reward!",
            description: "You earned 2 tokens for chatting with Zappy! Keep the conversation going!",
            duration: 5000,
          });
        }, 1000);
      }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Chat with Zappy</h1>
          <p className="text-gray-400">Your AI companion on the learning journey</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Zappy Info Card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-lg p-5 sticky top-24">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center mb-4">
                  <Bot className="h-10 w-10 text-brand-purple" />
                </div>
                <h2 className="text-xl font-bold">Zappy</h2>
                <p className="text-sm text-gray-400 mt-1">Web3 Learning Buddy</p>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm">
                  <h3 className="font-medium mb-2">How Zappy helps:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-brand-purple mt-1" />
                      <span>Motivates you to complete tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-brand-purple mt-1" />
                      <span>Shares learning strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-brand-purple mt-1" />
                      <span>Provides productivity tips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-brand-purple mt-1" />
                      <span>Occasionally rewards engagement</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-xs text-center text-gray-500 pt-2">
                  Chat regularly with Zappy to stay motivated on your learning journey!
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-lg overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        {message.sender === 'zappy' ? (
                          <div className="h-8 w-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-brand-purple" />
                          </div>
                        ) : (
                          <Avatar className="h-8 w-8 border border-brand-purple/30">
                            <AvatarImage src={user?.avatarUrl} />
                            <AvatarFallback className="bg-brand-dark-lighter">
                              <UserIcon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div 
                          className={`rounded-lg p-3 ${
                            message.sender === 'user' 
                              ? 'bg-brand-purple text-white' 
                              : 'bg-brand-dark-lighter/50 border border-brand-purple/10'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {thinking && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
                          <RefreshCw className="h-4 w-4 text-brand-purple animate-spin" />
                        </div>
                        <div className="rounded-lg p-3 bg-brand-dark-lighter/50 border border-brand-purple/10">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></span>
                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input */}
              <div className="border-t border-brand-purple/20 p-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="purple-gradient"
                    disabled={!input.trim() || thinking}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ZappyChat;
