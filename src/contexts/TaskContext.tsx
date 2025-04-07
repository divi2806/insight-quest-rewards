
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useWeb3 } from './Web3Context';
import { mockTasks, verifyTask } from '../lib/mockData';
import { Task } from '../types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Share2, 
  CheckCircle2, 
  Coins
} from "lucide-react";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Partial<Task>) => void;
  completeTask: (taskId: string) => Promise<void>;
  verifyTaskCompletion: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: false,
  addTask: () => {},
  completeTask: async () => {},
  verifyTaskCompletion: async () => {},
  deleteTask: () => {},
});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const { user } = useWeb3();

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      // Filter tasks for the current user
      setTasks(mockTasks.filter(task => task.userId === user.id));
    } else {
      setTasks([]);
    }
  }, [user]);

  const addTask = (taskData: Partial<Task>) => {
    if (!user) {
      toast.error('You need to connect your wallet first');
      return;
    }

    // Generate random rewards based on task type
    const randomReward = Math.floor(Math.random() * 20) + 5;  // 5-25 tokens
    const randomXP = Math.floor(Math.random() * 150) + 50;   // 50-200 XP

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 10),
      userId: user.id,
      title: taskData.title || '',
      description: taskData.description || '',
      type: taskData.type || 'leetcode',
      status: 'pending',
      reward: randomReward,
      xpReward: randomXP,
      url: taskData.url,
      dateCreated: new Date().toISOString(),
    };

    mockTasks.push(newTask);
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully');
  };

  const completeTask = async (taskId: string) => {
    try {
      setLoading(true);
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        toast.error('Task not found');
        return;
      }

      const updatedTask: Task = {
        ...tasks[taskIndex],
        status: 'completed',
        dateCompleted: new Date().toISOString(),
      };

      mockTasks[mockTasks.findIndex(t => t.id === taskId)] = updatedTask;
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;
      setTasks(updatedTasks);
      
      // Open sharing dialog
      setCompletedTaskId(taskId);
      setShareDialogOpen(true);
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'instagram') => {
    if (!completedTaskId) return;
    
    const task = tasks.find(t => t.id === completedTaskId);
    if (!task) return;
    
    // In a real app, this would open the respective sharing dialog
    // For now, we'll simulate it with a toast
    toast.success(`Shared your achievement to ${platform}!`);
    
    // Give bonus tokens for sharing
    const bonusTokens = 5;
    toast.success(`Earned ${bonusTokens} bonus $TASK tokens for sharing!`, {
      icon: <Coins className="h-4 w-4 text-yellow-500" />
    });
    
    // Close dialog
    setShareDialogOpen(false);
    setCompletedTaskId(null);
  };

  const verifyTaskCompletion = async (taskId: string) => {
    try {
      setLoading(true);
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        toast.error('Task not found');
        return;
      }

      const task = tasks[taskIndex];
      const verified = await verifyTask(task);

      if (verified) {
        const updatedTask: Task = {
          ...task,
          status: 'verified',
        };

        mockTasks[mockTasks.findIndex(t => t.id === taskId)] = updatedTask;
        
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
        
        toast.success('Task verified successfully!');
      } else {
        toast.error('Task verification failed');
      }
    } catch (error) {
      console.error('Error verifying task:', error);
      toast.error('Failed to verify task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = (taskId: string) => {
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        completeTask,
        verifyTaskCompletion,
        deleteTask,
      }}
    >
      {children}
      
      {/* Share Achievement Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Congratulations on completing your task!
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-6">
              Would you like to share your achievement and earn 5 bonus $TASK tokens?
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => handleShare('twitter')} 
                variant="outline" 
                className="flex items-center gap-3 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
              >
                <Twitter className="h-5 w-5" />
                Share on Twitter
              </Button>
              <Button 
                onClick={() => handleShare('linkedin')} 
                variant="outline"
                className="flex items-center gap-3 border-blue-700/30 text-blue-700 hover:bg-blue-700/10"
              >
                <Linkedin className="h-5 w-5" />
                Share on LinkedIn
              </Button>
              <Button 
                onClick={() => handleShare('instagram')} 
                variant="outline"
                className="flex items-center gap-3 border-pink-600/30 text-pink-600 hover:bg-pink-600/10"
              >
                <Instagram className="h-5 w-5" />
                Share on Instagram
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShareDialogOpen(false)}
            >
              Maybe later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TaskContext.Provider>
  );
};
