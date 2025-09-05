/**
 * AI Placeholder Functions
 * 
 * Provides mock AI functionality with clear TODOs for production integration.
 * Replace these functions with real AI service calls when ready.
 * 
 * Environment variables needed for production:
 * - VITE_OPENAI_API_KEY (client-side, not recommended for production)
 * - Or create a server-side proxy endpoint at /api/ai for secure API key handling
 */

// Mock AI response structure
export interface AIResponse {
  content: string;
  type: 'text' | 'suggestions' | 'analysis';
  confidence?: number;
  metadata?: Record<string, any>;
}

/**
 * Mock resume analysis - replace with real AI service
 * TODO: Integrate with OpenAI GPT-4 or similar service
 */
export async function analyzeResume(resumeText: string): Promise<AIResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // TODO: Replace with real AI analysis
  // const response = await fetch('/api/ai/analyze-resume', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ resumeText })
  // });
  
  return {
    content: "Your resume shows strong technical skills. Consider adding more quantifiable achievements and specific project outcomes to make it more compelling to ATS systems.",
    type: 'analysis',
    confidence: 0.85,
    metadata: {
      wordCount: resumeText.length,
      keywordsFound: ['JavaScript', 'React', 'Python'],
      atsScore: 78
    }
  };
}

/**
 * Mock chat response generation
 * TODO: Integrate with OpenAI Chat Completions API
 */
export async function generateChatResponse(message: string, context: string): Promise<AIResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // TODO: Replace with real AI chat
  // const response = await fetch('/api/ai/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message, context })
  // });
  
  return {
    content: "I understand you're asking about career guidance. While I'm currently running on mock responses, I can still provide structured advice based on common industry practices.",
    type: 'text'
  };
}

/**
 * Mock ATS optimization suggestions
 * TODO: Integrate with specialized resume parsing AI
 */
export async function generateATSSuggestions(resumeText: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Replace with real ATS analysis
  return [
    "Add more specific keywords from the job description",
    "Use bullet points instead of paragraph format",
    "Include quantifiable achievements (e.g., 'Increased efficiency by 25%')",
    "Ensure consistent date formatting throughout",
    "Add a skills section with relevant technical keywords"
  ];
}

// Configuration for AI services
export const AI_CONFIG = {
  // TODO: Set these in production
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  maxTokens: 1000,
  temperature: 0.7,
  model: 'gpt-4',
  
  // Server-side endpoint (recommended approach)
  apiEndpoint: '/api/ai',
  
  // Mock mode flag
  useMockResponses: true // Set to false when real AI is connected
};