/**
 * Hardcoded chatbot conversation flow tree structure
 * This defines all possible conversation paths and responses
 * To modify bot responses, edit the messages and options in this file
 */

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: ChatOption[];
  showForm?: boolean;
}

export interface ChatOption {
  id: string;
  text: string;
  nextAction?: string;
  navigateTo?: string;
  externalUrl?: string;
}

export interface ChatFlow {
  [key: string]: {
    message: string;
    options?: ChatOption[];
    showForm?: boolean;
  };
}

// Main conversation flow - modify messages here to change bot responses
export const chatFlow: ChatFlow = {
  greeting: {
    message: "Hi — are you a Candidate or a Company?",
    options: [
      { id: "candidate", text: "Candidate", nextAction: "candidate_menu" },
      { id: "company", text: "Company", nextAction: "company_menu" }
    ]
  },

  // CANDIDATE FLOW
  candidate_menu: {
    message: "How can I help you today?",
    options: [
      { id: "create_profile", text: "Create a profile", nextAction: "candidate_create" },
      { id: "edit_profile", text: "Edit my profile", nextAction: "candidate_edit" },
      { id: "schedule_call", text: "Schedule a call", nextAction: "candidate_schedule" },
      { id: "learn_how", text: "Learn how it works", nextAction: "candidate_learn" }
    ]
  },

  candidate_create: {
    message: "Great — go to Create Profile. I can open the Candidate page for you.",
    options: [
      { id: "open_candidate", text: "Open /candidate", navigateTo: "/candidate" },
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  candidate_edit: {
    message: "Editing is available after you save a profile. Would you like tips to prepare your resume?",
    options: [
      { id: "resume_tips_yes", text: "Yes", nextAction: "resume_tips" },
      { id: "resume_tips_no", text: "No", nextAction: "greeting" }
    ]
  },

  resume_tips: {
    message: "Here are quick resume tips:\n• Highlight quantifiable achievements\n• Use action verbs and industry keywords\n• Keep it concise (1-2 pages max)",
    options: [
      { id: "back_candidate", text: "Back to Candidate", navigateTo: "/candidate" },
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  candidate_schedule: {
    message: "Schedule a call with our team using the link below:",
    options: [
      { id: "open_scheduler", text: "Open Scheduler", externalUrl: process.env.NEXT_PUBLIC_CALCOM_URL || "https://cal.com" },
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  candidate_learn: {
    message: "Here's how it works:\n1) Create your profile\n2) Companies search our database\n3) Get contacted directly by interested employers",
    options: [
      { id: "read_how", text: "Read How it Works", navigateTo: "/how" },
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  // COMPANY FLOW
  company_menu: {
    message: "What do you need?",
    options: [
      { id: "browse_candidates", text: "Browse candidates", nextAction: "company_browse" },
      { id: "filter_skills", text: "Filter by skills", nextAction: "company_filter" },
      { id: "request_demo", text: "Request a demo", nextAction: "company_demo" },
      { id: "contact_support", text: "Contact support", nextAction: "company_support" }
    ]
  },

  company_browse: {
    message: "Open the Company browser to see public candidate profiles",
    options: [
      { id: "open_company", text: "Open /company", navigateTo: "/company" },
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  company_filter: {
    message: "Use the filter panel on the Company page. Would you like sample filter suggestions?",
    options: [
      { id: "filter_yes", text: "Yes", nextAction: "filter_suggestions" },
      { id: "filter_no", text: "No", nextAction: "greeting" }
    ]
  },

  filter_suggestions: {
    message: "Popular filter suggestions:\n• React + TypeScript\n• Python + Machine Learning\n• Remote-first candidates\n• Senior level (5+ years)",
    options: [
      { id: "open_company", text: "Try filters", navigateTo: "/company" },
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  company_demo: {
    message: "Fill this short form to request a personalized demo:",
    showForm: true,
    options: [
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  company_support: {
    message: "Contact our support team at support@talentcanvas.com or schedule a call:",
    options: [
      { id: "schedule_support", text: "Schedule a call", externalUrl: process.env.NEXT_PUBLIC_CALCOM_URL || "https://cal.com" },
      { id: "back_main", text: "Back to menu", nextAction: "greeting" }
    ]
  },

  // FALLBACKS
  fallback: {
    message: "Sorry, I don't understand that yet. Choose one of the menu options or type 'help'.",
    options: [
      { id: "back_main", text: "Back to main menu", nextAction: "greeting" },
      { id: "help", text: "Help", nextAction: "help" }
    ]
  },

  help: {
    message: "I can help you with:\n• Creating candidate profiles\n• Company features\n• Scheduling calls\n• General questions about our platform",
    options: [
      { id: "back_main", text: "Back to main menu", nextAction: "greeting" }
    ]
  }
};