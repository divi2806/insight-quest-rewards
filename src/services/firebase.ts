
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc, setDoc, orderBy, limit } from "firebase/firestore";
import { Agent, User, Task } from "@/types";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnDfjtEFJDEzp8hTLzbiiMl12UiO0Apwc",
  authDomain: "fir-auth-ccbfc.firebaseapp.com",
  projectId: "fir-auth-ccbfc",
  storageBucket: "fir-auth-ccbfc.firebasestorage.app",
  messagingSenderId: "506766226261",
  appId: "1:506766226261:web:dbfdcafb20bb5f3c2f75dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections
const usersCollection = collection(db, "users");
const agentsCollection = collection(db, "agents");
const chatMessagesCollection = collection(db, "chatMessages");
const contestsCollection = collection(db, "contests");
const quizAttemptsCollection = collection(db, "quizAttempts");

// User functions
export const saveUser = async (user: User) => {
  try {
    const userDoc = doc(usersCollection, user.id);
    await setDoc(userDoc, { ...user }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user:", error);
    return false;
  }
};

export const getUser = async (userId: string) => {
  try {
    const userDoc = doc(usersCollection, userId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const updateUserXP = async (userId: string, xpToAdd: number) => {
  try {
    const userDoc = doc(usersCollection, userId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as User;
      const currentXP = userData.xp || 0;
      const newXP = currentXP + xpToAdd;
      
      await updateDoc(userDoc, {
        xp: newXP
      });
      
      return {
        success: true,
        oldXP: currentXP,
        newXP,
        oldLevel: userData.level,
        newLevel: Math.floor(Math.sqrt(newXP / 100)) + 1
      };
    }
    
    return { success: false };
  } catch (error) {
    console.error("Error updating user XP:", error);
    return { success: false };
  }
};

// Agent functions
export const saveAgent = async (agent: Agent) => {
  try {
    if (agent.id) {
      // Update existing agent
      const agentDoc = doc(agentsCollection, agent.id);
      await setDoc(agentDoc, agent, { merge: true });
    } else {
      // Add new agent with generated ID
      await addDoc(agentsCollection, {
        ...agent,
        dateCreated: new Date().toISOString(),
        purchasedBy: agent.purchasedBy || []
      });
    }
    return true;
  } catch (error) {
    console.error("Error saving agent:", error);
    return false;
  }
};

export const getAgents = async () => {
  try {
    const querySnapshot = await getDocs(agentsCollection);
    const agents: Agent[] = [];
    
    querySnapshot.forEach((doc) => {
      const agent = { id: doc.id, ...doc.data() } as Agent;
      agents.push(agent);
    });
    
    return agents;
  } catch (error) {
    console.error("Error getting agents:", error);
    return [];
  }
};

export const purchaseAgent = async (agentId: string, userId: string) => {
  try {
    const agentDoc = doc(agentsCollection, agentId);
    await updateDoc(agentDoc, {
      purchasedBy: arrayUnion(userId)
    });
    return true;
  } catch (error) {
    console.error("Error purchasing agent:", error);
    return false;
  }
};

// Chat message functions
export interface ChatMessage {
  id?: string;
  userId: string;
  sender: "user" | "zappy";
  content: string;
  timestamp: string;
}

export const saveChatMessage = async (message: ChatMessage) => {
  try {
    await addDoc(chatMessagesCollection, {
      ...message,
      timestamp: message.timestamp || new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving chat message:", error);
    return false;
  }
};

export const getUserChatHistory = async (userId: string) => {
  try {
    const q = query(
      chatMessagesCollection, 
      where("userId", "==", userId),
      orderBy("timestamp", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const messages: ChatMessage[] = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
    });
    
    return messages;
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
};

// Quiz attempt functions
export interface QuizAttempt {
  id?: string;
  userId: string;
  taskId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptNumber: number;
  timestamp: string;
}

export const saveQuizAttempt = async (attempt: QuizAttempt) => {
  try {
    await addDoc(quizAttemptsCollection, {
      ...attempt,
      timestamp: attempt.timestamp || new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    return false;
  }
};

export const getQuizAttempts = async (userId: string, taskId: string) => {
  try {
    const q = query(
      quizAttemptsCollection,
      where("userId", "==", userId),
      where("taskId", "==", taskId),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const attempts: QuizAttempt[] = [];
    
    querySnapshot.forEach((doc) => {
      attempts.push({ id: doc.id, ...doc.data() } as QuizAttempt);
    });
    
    return attempts;
  } catch (error) {
    console.error("Error getting quiz attempts:", error);
    return [];
  }
};

export const getLatestQuizAttempt = async (userId: string, taskId: string) => {
  try {
    const q = query(
      quizAttemptsCollection,
      where("userId", "==", userId),
      where("taskId", "==", taskId),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as QuizAttempt;
  } catch (error) {
    console.error("Error getting latest quiz attempt:", error);
    return null;
  }
};

export default {
  db,
  saveUser,
  getUser,
  updateUserXP,
  saveAgent,
  getAgents,
  purchaseAgent,
  saveChatMessage,
  getUserChatHistory,
  saveQuizAttempt,
  getQuizAttempts,
  getLatestQuizAttempt
};
