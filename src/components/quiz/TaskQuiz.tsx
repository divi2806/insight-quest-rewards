
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader, 
  ArrowRight, 
  RefreshCw, 
  Trophy, 
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { saveQuizAttempt, getQuizAttempts } from '@/services/firebase';
import { useWeb3 } from '@/contexts/Web3Context';
import { Task } from '@/types';

interface TaskQuizProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onFailure: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Sample quiz questions based on task type
const generateQuestions = (task: Task): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  // Common questions for all educational content
  const commonQuestions = [
    {
      id: 1,
      question: "What's the main benefit of completing this learning task?",
      options: [
        "Earning $TASK tokens",
        "Gaining practical knowledge and skills",
        "Advancing in the platform level system",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      id: 2,
      question: "How does InsightQuest verify your learning progress?",
      options: [
        "Through manual review by moderators",
        "Using quiz assessments like this one",
        "By tracking time spent on resources",
        "Using blockchain verification"
      ],
      correctAnswer: 1
    }
  ];
  
  // Add type-specific questions
  if (task.type === "video") {
    questions.push(
      {
        id: 3,
        question: "What is the best practice when watching educational videos?",
        options: [
          "Watch at 2x speed to save time",
          "Take notes while watching",
          "Just watch passively and absorb information",
          "Skip to the important parts only"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: `Based on the video title "${task.title}", which topic is likely covered?`,
        options: generateOptionsFromTitle(task.title),
        correctAnswer: 0
      },
      {
        id: 5,
        question: "What should you do after watching an educational video?",
        options: [
          "Immediately watch another video",
          "Take a test to verify understanding",
          "Apply what you've learned through practice",
          "Share the video with friends"
        ],
        correctAnswer: 2
      }
    );
  } else if (task.type === "course") {
    questions.push(
      {
        id: 3,
        question: "What's the most effective way to complete an online course?",
        options: [
          "Skip through sections you already know",
          "Complete all exercises and assignments",
          "Read the summaries only",
          "Focus only on the final assessment"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: `What skills might you gain from this course "${task.title}"?`,
        options: generateOptionsFromTitle(task.title),
        correctAnswer: 0
      },
      {
        id: 5,
        question: "How does completing courses benefit your InsightQuest profile?",
        options: [
          "It only provides tokens",
          "It increases your level and reputation",
          "It allows you to create your own courses",
          "It has no impact on your profile"
        ],
        correctAnswer: 1
      }
    );
  }
  
  // Add the common questions
  questions.push(...commonQuestions);
  
  // Randomize the order of questions
  return shuffleArray(questions).slice(0, 5).map((q, idx) => ({
    ...q,
    id: idx
  }));
};

// Helper function to generate plausible options based on task title
const generateOptionsFromTitle = (title: string): string[] => {
  const lowerTitle = title.toLowerCase();
  let mainOptions = [];
  
  // Identify relevant topics from the title
  if (lowerTitle.includes("blockchain") || lowerTitle.includes("crypto") || lowerTitle.includes("web3")) {
    mainOptions = ["Blockchain fundamentals", "Cryptocurrency applications", "Web3 development", "Digital asset management"];
  } else if (lowerTitle.includes("python") || lowerTitle.includes("javascript") || lowerTitle.includes("coding")) {
    mainOptions = ["Programming fundamentals", "Algorithm development", "Software architecture", "Data structures"];
  } else if (lowerTitle.includes("finance") || lowerTitle.includes("investment") || lowerTitle.includes("trading")) {
    mainOptions = ["Financial principles", "Investment strategies", "Market analysis", "Risk management"];
  } else {
    // Generic options if no specific topic is detected
    mainOptions = ["Practical applications of the subject", "Theoretical foundations", "Advanced techniques", "Industry best practices"];
  }
  
  return shuffleArray(mainOptions);
};

// Shuffle array helper function
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const TaskQuiz: React.FC<TaskQuizProps> = ({ task, open, onOpenChange, onSuccess, onFailure }) => {
  const { user } = useWeb3();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  
  // Initialize quiz when opened
  useEffect(() => {
    if (open && user) {
      initializeQuiz();
    }
  }, [open, user]);
  
  const initializeQuiz = async () => {
    setLoading(true);
    try {
      // Check previous attempts
      if (user?.id) {
        const previousAttempts = await getQuizAttempts(user.id, task.id);
        const attemptsCount = previousAttempts.length;
        
        if (attemptsCount >= 2) {
          setMaxAttemptsReached(true);
          setLoading(false);
          return;
        }
        
        setAttemptNumber(attemptsCount + 1);
      }
      
      // Generate new questions
      const newQuestions = generateQuestions(task);
      setQuestions(newQuestions);
      
      // Reset quiz state
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCorrectAnswers(0);
      setQuizCompleted(false);
    } catch (error) {
      console.error("Error initializing quiz:", error);
      toast.error("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionIndex);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswerSubmitted(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = async () => {
    setQuizCompleted(true);
    const score = correctAnswers + (selectedOption === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
    const totalQuestions = questions.length;
    const passed = score / totalQuestions >= 0.6; // 60% passing threshold
    
    // Save attempt to Firebase
    if (user?.id) {
      await saveQuizAttempt({
        userId: user.id,
        taskId: task.id,
        score,
        totalQuestions,
        passed,
        attemptNumber,
        timestamp: new Date().toISOString()
      });
      
      // If passed or max attempts reached, call appropriate callback
      if (passed) {
        toast.success("Quiz passed! You've earned your rewards.");
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
        }, 2000);
      } else if (attemptNumber >= 2) {
        toast.error("Maximum attempts reached. Try another task.");
        setTimeout(() => {
          onFailure();
          onOpenChange(false);
        }, 2000);
      }
    }
  };
  
  const handleRetry = () => {
    if (attemptNumber < 2) {
      setAttemptNumber(prev => prev + 1);
      initializeQuiz();
    } else {
      setMaxAttemptsReached(true);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100;
  
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card border-brand-purple/20">
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader className="h-10 w-10 animate-spin text-brand-purple mb-4" />
            <p>Loading quiz...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (maxAttemptsReached) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card border-brand-purple/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Maximum Attempts Reached</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mb-4" />
            <p className="text-center mb-4">
              You've already used all your attempts for this quiz. You need to pass the quiz to earn $TASK tokens.
            </p>
            <p className="text-center text-sm text-gray-400">
              Try another task or revisit the learning material to improve your knowledge.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                onFailure();
                onOpenChange(false);
              }}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-brand-purple/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Knowledge Check: {task.title}</DialogTitle>
        </DialogHeader>
        
        {!quizCompleted ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Attempt {attemptNumber}/2</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="py-2">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-1">
                  {questions[currentQuestionIndex]?.question}
                </h3>
                <p className="text-sm text-gray-400">
                  Select the best answer
                </p>
              </div>
              
              <div className="space-y-3">
                {questions[currentQuestionIndex]?.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedOption === idx
                        ? "border-brand-purple bg-brand-purple/10"
                        : "border-gray-700 hover:border-gray-500"
                    } ${
                      isAnswerSubmitted
                        ? idx === questions[currentQuestionIndex].correctAnswer
                          ? "border-green-500 bg-green-500/10"
                          : selectedOption === idx
                            ? "border-red-500 bg-red-500/10"
                            : ""
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(idx)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">{option}</div>
                      
                      {isAnswerSubmitted && (
                        <>
                          {idx === questions[currentQuestionIndex].correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
                          )}
                          {selectedOption === idx && idx !== questions[currentQuestionIndex].correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-500 ml-2 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              {!isAnswerSubmitted ? (
                <Button
                  className="purple-gradient"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  className="purple-gradient"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Complete Quiz"
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <div className="flex flex-col items-center mb-6">
              {correctAnswers / questions.length >= 0.6 ? (
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Trophy className="h-10 w-10 text-yellow-400" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <AlertCircle className="h-10 w-10 text-orange-400" />
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">
                {correctAnswers / questions.length >= 0.6
                  ? "Quiz Passed!"
                  : "Keep Learning"
                }
              </h3>
              
              <div className="text-center mb-4">
                <p className="text-2xl font-bold">
                  {correctAnswers} / {questions.length}
                </p>
                <p className="text-sm text-gray-400">
                  {correctAnswers / questions.length >= 0.6
                    ? "Great job! You've earned the task rewards."
                    : `You need ${Math.ceil(questions.length * 0.6)} correct answers to pass.`
                  }
                </p>
              </div>
              
              {correctAnswers / questions.length < 0.6 && attemptNumber < 2 && (
                <div className="bg-brand-dark-lighter/50 rounded-md p-3 text-sm mb-4">
                  <p>
                    Don't worry! You have another attempt available. Review the material and try again.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              {correctAnswers / questions.length < 0.6 && attemptNumber < 2 ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto"
                  >
                    Review Material
                  </Button>
                  <Button 
                    className="purple-gradient w-full sm:w-auto"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </>
              ) : (
                <Button 
                  className={correctAnswers / questions.length >= 0.6 
                    ? "purple-gradient w-full" 
                    : "w-full"
                  }
                  variant={correctAnswers / questions.length >= 0.6 ? "default" : "outline"}
                  onClick={() => {
                    if (correctAnswers / questions.length >= 0.6) {
                      onSuccess();
                    } else {
                      onFailure();
                    }
                    onOpenChange(false);
                  }}
                >
                  {correctAnswers / questions.length >= 0.6 ? "Claim Rewards" : "Close"}
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskQuiz;
