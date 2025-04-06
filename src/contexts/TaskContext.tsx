
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useWeb3 } from './Web3Context';
import { mockTasks, verifyTask } from '../lib/mockData';
import { Task } from '../types';

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

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 10),
      userId: user.id,
      title: taskData.title || '',
      description: taskData.description || '',
      type: taskData.type || 'leetcode',
      status: 'pending',
      reward: taskData.reward || 10,
      xpReward: taskData.xpReward || 100,
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
      
      toast.success('Task marked as completed');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    } finally {
      setLoading(false);
    }
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
    </TaskContext.Provider>
  );
};
