/**
 * Ask JOD Mock Responses
 * 
 * Provides deterministic AI-style responses for the Ask JOD feature.
 * Replace this with real AI integration for production.
 * 
 * USAGE NOTES:
 * 1. To enable real AI: Set AI_CONFIG.useMockResponses = false in ai-placeholder.ts
 * 2. Add server-side LLM proxy at /api/ai/chat endpoint
 * 3. Set VITE_OPENAI_API_KEY or use server-side key management
 * 4. Update generateResponse() to call actual AI service
 */

import { PERSONAS, type Persona } from './chat-personas';

export interface MockChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  persona?: string;
}

export interface MockResponse {
  content: string;
  followUpQuestions?: string[];
  actions?: Array<{
    label: string;
    type: 'navigate' | 'external' | 'download';
    url?: string;
  }>;
}

// Pattern-based response mapping
const RESPONSE_PATTERNS: Array<{
  pattern: RegExp;
  response: (matches: RegExpMatchArray, persona: Persona) => MockResponse;
}> = [
  {
    pattern: /(?:how|what).*(start|begin|get started|break into)/i,
    response: (matches, persona) => ({
      content: `Getting started in ${persona.field} requires focus on fundamentals. Based on current industry trends, I'd recommend starting with ${persona.expertise[0]} and ${persona.expertise[1]}. The key is building practical projects while learning theory.`,
      followUpQuestions: [
        `What specific area of ${persona.field} interests you most?`,
        'Do you have any relevant background or experience?',
        'What timeline are you working with for this transition?'
      ]
    })
  },
  {
    pattern: /(?:skill|learn|study|improve)/i,
    response: (matches, persona) => ({
      content: `For ${persona.field} skill development, focus on these core areas: ${persona.expertise.slice(0, 3).join(', ')}. I recommend a hands-on approach with real projects that demonstrate your capabilities to potential employers.`,
      followUpQuestions: [
        'Which of these skills do you already have experience with?',
        'Are you looking for free or paid learning resources?',
        'Do you prefer self-paced or structured learning?'
      ],
      actions: [
        {
          label: 'View Learning Resources',
          type: 'navigate',
          url: '/resources'
        }
      ]
    })
  },
  {
    pattern: /(?:interview|prepare|job|application)/i,
    response: (matches, persona) => ({
      content: `Interview preparation for ${persona.field} roles should cover both technical and behavioral aspects. Focus on demonstrating your understanding of ${persona.expertise[0]} through concrete examples and be ready to discuss problem-solving approaches.`,
      followUpQuestions: [
        'What type of role are you interviewing for?',
        'Do you need help with technical or behavioral questions?',
        'Have you practiced coding problems recently?'
      ],
      actions: [
        {
          label: 'Practice Interview Questions',
          type: 'navigate',
          url: '/interview-prep'
        }
      ]
    })
  },
  {
    pattern: /(?:salary|negotiate|offer|compensation)/i,
    response: (matches, persona) => ({
      content: `Salary negotiation in ${persona.field} depends on several factors: location, company size, your experience level, and current market rates. Research industry standards and be prepared to articulate your value proposition based on specific skills and achievements.`,
      followUpQuestions: [
        'What level of position are you targeting?',
        'Do you have competing offers to leverage?',
        'Are you comfortable negotiating beyond base salary?'
      ]
    })
  },
  {
    pattern: /(?:portfolio|project|showcase)/i,
    response: (matches, persona) => ({
      content: `A strong ${persona.field} portfolio should highlight your best work and demonstrate progression in your skills. Include 3-5 projects that show different aspects of ${persona.expertise.slice(0, 2).join(' and ')}, with clear documentation of your role and the technologies used.`,
      followUpQuestions: [
        'What projects are you most proud of?',
        'Do you have any live deployments to showcase?',
        'How do you typically document your work?'
      ],
      actions: [
        {
          label: 'Portfolio Builder',
          type: 'navigate',
          url: '/portfolio'
        }
      ]
    })
  }
];

// Fallback responses for unmatched queries
const FALLBACK_RESPONSES: MockResponse[] = [
  {
    content: "That's an interesting question about professional development. While I don't have a specific response for that topic, I can help you think through it systematically. Could you break down what specific aspect you'd like to focus on?",
    followUpQuestions: [
      'What specific outcome are you hoping to achieve?',
      'Have you tried researching this topic before?',
      'Would you like me to suggest some general approaches?'
    ]
  },
  {
    content: "I'd love to help you with that career question. To give you the most relevant guidance, could you provide a bit more context about your background and what you're trying to accomplish?",
    followUpQuestions: [
      'What\'s your current experience level?',
      'Are you looking for immediate or long-term guidance?',
      'What challenges are you facing specifically?'
    ]
  }
];

/**
 * Generates a mock AI response based on user input and selected persona
 * TODO: Replace with real AI service call in production
 */
export function generateMockResponse(message: string, personaId: string): MockResponse {
  const persona = PERSONAS[personaId];
  if (!persona) {
    return {
      content: "I'm sorry, but I couldn't find the appropriate persona to help with your question. Please try selecting a different specialist area.",
      followUpQuestions: ['Would you like to choose a different persona?']
    };
  }

  // Try to match against patterns
  for (const { pattern, response } of RESPONSE_PATTERNS) {
    const matches = message.match(pattern);
    if (matches) {
      return response(matches, persona);
    }
  }

  // Return fallback response
  const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  return {
    ...fallback,
    content: `${fallback.content} As a ${persona.title}, I can particularly help with topics related to ${persona.expertise.slice(0, 2).join(' and ')}.`
  };
}

/**
 * Generates search prompts for companies (hiring advisor persona)
 */
export function generateSearchPrompt(jobDescription: string): string {
  // TODO: Replace with AI-powered job description analysis
  const keywords = extractKeywords(jobDescription);
  return `Search for candidates with: ${keywords.slice(0, 5).join(', ')}. Experience level: ${detectExperienceLevel(jobDescription)}. Location preferences: ${detectLocationPreferences(jobDescription)}.`;
}

// Helper functions for search prompt generation
function extractKeywords(text: string): string[] {
  const techKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 
    'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST API'
  ];
  
  return techKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

function detectExperienceLevel(text: string): string {
  const juniorTerms = ['junior', 'entry', 'graduate', '0-2 years', 'new grad'];
  const seniorTerms = ['senior', 'lead', 'principal', '5+ years', 'experienced'];
  
  const lowerText = text.toLowerCase();
  
  if (seniorTerms.some(term => lowerText.includes(term))) return 'Senior';
  if (juniorTerms.some(term => lowerText.includes(term))) return 'Junior';
  return 'Mid-level';
}

function detectLocationPreferences(text: string): string {
  if (text.toLowerCase().includes('remote')) return 'Remote';
  if (text.toLowerCase().includes('onsite')) return 'On-site';
  return 'Hybrid/Flexible';
}

/**
 * Sample conversation starters for each persona
 */
export const CONVERSATION_STARTERS: Record<string, string[]> = {
  'ai-ml': [
    'How do I transition from web development to machine learning?',
    'What programming languages are essential for AI research?',
    'How can I build a portfolio for ML engineering roles?'
  ],
  'cybersecurity': [
    'What certifications should I pursue for cybersecurity?',
    'How do I get hands-on experience with ethical hacking?',
    'What are the most in-demand security skills right now?'
  ],
  'webdev': [
    'How do I advance from junior to senior developer?',
    'What backend technologies should I learn next?',
    'How do I prepare for system design interviews?'
  ],
  'devops': [
    'What\'s the best way to learn Kubernetes?',
    'How do I transition from software development to DevOps?',
    'Which cloud platform should I focus on first?'
  ],
  'product': [
    'How do I break into product management without prior PM experience?',
    'What frameworks are most important for product managers?',
    'How do I develop better user research skills?'
  ],
  'general': [
    'How do I negotiate a better salary offer?',
    'What should I include in my LinkedIn profile?',
    'How do I prepare for behavioral interview questions?'
  ],
  'hiring-advisor': [
    'How do I write job descriptions that attract quality candidates?',
    'What interview questions best assess problem-solving skills?',
    'How can I improve my company\'s hiring process?'
  ]
};