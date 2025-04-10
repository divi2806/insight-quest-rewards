
import { GoogleGenerativeAI } from "@google/generative-ai";

// API key for Gemini (this would be replaced with real API key in production)
const API_KEY = "12345678";

// Initialize the API
const genAI = new GoogleGenerativeAI(API_KEY);

// Generate a response using Gemini
export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    // For simplicity, we'll use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Fallback to pre-defined responses if Gemini API fails
    return "I'm having trouble connecting to my AI services right now. Let me respond based on what I already know!";
  }
};

export default { generateAIResponse };
