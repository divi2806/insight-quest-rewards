
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
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
    const q = query(chatMessagesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const messages: ChatMessage[] = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
    });
    
    // Sort by timestamp
    return messages.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
};

export default {
  db,
  saveUser,
  getUser,
  saveAgent,
  getAgents,
  purchaseAgent,
  saveChatMessage,
  getUserChatHistory
};
