/**
 * Ask JOD - ChatGPT-style AI Career Assistant (Full Page UI)
 * 
 * Features:
 * - Minimal top bar with breadcrumb navigation and theme toggle
 * - Time-based greeting on new conversations  
 * - 20 hardcoded assistant messages with pattern matching
 * - Local storage for chat history (localStorage.jod_chats_v1)
 * - PDF export and conversation management
 * - Mobile-responsive with collapsible sidebar
 * - Keyboard shortcuts: N/Ctrl+N for new chat, Escape to close modals
 * 
 * Storage keys:
 * - localStorage.jod_chats_v1: Array of conversations
 * - localStorage.jod_role: User role (candidate/company)
 * 
 * TODO: Replace hardcoded responses with server-side LLM proxy
 * TODO: Add NEXT_PUBLIC_OPENAI_KEY for production AI integration
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AskJodSidebar } from "@/components/AskJodSidebar";
import { AskJodMain } from "@/components/AskJodMain";
import { AskJodComposer } from "@/components/AskJodComposer";
import { AskJodTopbar } from "@/components/AskJodTopbar";
import { generateTimeBasedGreeting, getAssistantResponse } from "@/lib/ask-jod-mock";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: Date;
  updated_at: Date;
}

// Metadata for the page
export const metadata = {
  title: "Ask JOD",
  description: "Chat-style career advisor (simulated)"
};

export default function AskJod() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start collapsed on mobile
  const [userRole, setUserRole] = useState<'candidate' | 'company' | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load data on mount
  useEffect(() => {
    // Client-side only guards
    if (typeof window === 'undefined') return;
    
    const role = localStorage.getItem('jod_role') as 'candidate' | 'company' | null;
    setUserRole(role);
    
    const savedChats = localStorage.getItem('jod_chats_v1');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          created_at: new Date(chat.created_at),
          updated_at: new Date(chat.updated_at),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(parsedChats);
        
        // If there are no conversations, create initial greeting
        if (parsedChats.length === 0) {
          // Wait a tick to ensure component is mounted
          setTimeout(() => {
            createNewConversation();
          }, 100);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        setConversations([]);
        // Create initial conversation on error
        setTimeout(() => {
          createNewConversation();
        }, 100);
      }
    } else {
      // No saved chats, create initial conversation
      setTimeout(() => {
        createNewConversation();
      }, 100);
    }
  }, []);

  // Debounced save conversations when they change
  const debouncedSave = useCallback((conversationsToSave: Conversation[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (typeof window === 'undefined') return;
      
      if (conversationsToSave.length > 0) {
        try {
          localStorage.setItem('jod_chats_v1', JSON.stringify(conversationsToSave));
        } catch (error) {
          console.error('Failed to save conversations:', error);
          toast({
            title: "Storage Error",
            description: "Could not save conversation. Please check your browser storage.",
            variant: "destructive"
          });
        }
      }
    }, 500);
  }, [toast]);

  useEffect(() => {
    debouncedSave(conversations);
  }, [conversations, debouncedSave]);

  // Auto-scroll to bottom when messages change or conversation switches
  useEffect(() => {
    if (messagesEndRef.current && typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'end'
        });
      }, 100);
    }
  }, [currentConversation?.messages, currentConversation?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // New chat: N or Ctrl+N
      if ((e.key === 'n' || e.key === 'N') && (e.ctrlKey || e.metaKey || !e.ctrlKey)) {
        if (!e.ctrlKey && !e.metaKey) {
          // Only 'N' key, check if not typing in input
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        }
        e.preventDefault();
        createNewConversation();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const createNewConversation = () => {
    if (typeof window === 'undefined') return;
    
    const now = new Date();
    const greeting = generateTimeBasedGreeting();
    
    const newConversation: Conversation = {
      id: now.getTime().toString(),
      title: "New conversation",
      messages: [
        {
          id: '1',
          role: 'assistant',
          text: greeting,
          timestamp: now
        }
      ],
      created_at: now,
      updated_at: now
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    
    toast({
      title: "New Conversation",
      description: "Started a new conversation"
    });
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
    
    toast({
      title: "Conversation Deleted",
      description: "The conversation has been removed"
    });
  };

  const clearAllConversations = () => {
    if (typeof window === 'undefined') return;
    
    setConversations([]);
    setCurrentConversation(null);
    localStorage.removeItem('jod_chats_v1');
    
    toast({
      title: "All Conversations Cleared",
      description: "Chat history has been reset"
    });
  };

  const updateConversationTitle = useCallback((conversationId: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;
    
    setConversations(prev => prev.map(c => 
      c.id === conversationId 
        ? { ...c, title: trimmedTitle, updated_at: new Date() }
        : c
    ));
    
    // Update current conversation if it matches
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(prev => prev ? { ...prev, title: trimmedTitle, updated_at: new Date() } : null);
    }
  }, [currentConversation?.id]);

  const sendMessage = async (text: string) => {
    if (!currentConversation || !text.trim()) return;

    const now = new Date();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: now
    };

    // Add user message
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      updated_at: now
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev => prev.map(c => 
      c.id === currentConversation.id ? updatedConversation : c
    ));

    // Generate assistant response
    setTimeout(() => {
      const assistantResponse = getAssistantResponse(text, userRole);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: assistantResponse,
        timestamp: new Date()
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updated_at: new Date()
      };

      setCurrentConversation(finalConversation);
      setConversations(prev => prev.map(c => 
        c.id === currentConversation.id ? finalConversation : c
      ));
    }, 1000 + Math.random() * 1500);
  };

  const exportConversationAsPDF = useCallback((conversation: Conversation) => {
    try {
      // Create a printable version of the chat
      const printContent = `
        <html>
          <head>
            <title>JOD Chat - ${conversation.title}</title>
            <style>
              body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
              .message { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
              .user { background: #e3f2fd; margin-left: 20%; }
              .assistant { background: #f5f5f5; margin-right: 20%; }
              .role { font-weight: bold; margin-bottom: 8px; }
              .timestamp { font-size: 0.8em; color: #666; margin-top: 8px; }
              .content { line-height: 1.5; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>JOD Chat Export</h1>
              <h2>${conversation.title}</h2>
              <p>Exported on: ${new Date().toLocaleString()}</p>
            </div>
            ${conversation.messages.map(msg => `
              <div class="message ${msg.role}">
                <div class="role">${msg.role === 'user' ? 'You' : 'JOD Assistant'}</div>
                <div class="content">${msg.text}</div>
                <div class="timestamp">${msg.timestamp.toLocaleString()}</div>
              </div>
            `).join('')}
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.print();
          setTimeout(() => printWindow.close(), 100);
        };
      }

      toast({
        title: "Chat Export",
        description: "PDF export dialog opened"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export chat as PDF",
        variant: "destructive"
      });
    }
  }, [toast]);

  const exportAllConversations = () => {
    const allChats = JSON.stringify(conversations, null, 2);
    const blob = new Blob([allChats], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jod-all-chats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "All Chats Exported",
      description: "Complete chat history downloaded"
    });
  };

  const importConversations = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const validatedChats = imported.map((chat: any) => ({
          ...chat,
          created_at: new Date(chat.created_at),
          updated_at: new Date(chat.updated_at),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        setConversations(validatedChats);
        toast({
          title: "Chats Imported",
          description: `Imported ${validatedChats.length} conversations`
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AskJodTopbar />
      
      <main className="pt-16 flex-1 flex overflow-hidden">
        <AskJodSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={createNewConversation}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          onClearAll={clearAllConversations}
          onExportAll={exportAllConversations}
          onImport={importConversations}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          {currentConversation ? (
            <>
              <AskJodMain
                conversation={currentConversation}
                userRole={userRole}
                onUpdateTitle={updateConversationTitle}
                onExportPDF={exportConversationAsPDF}
                onDelete={deleteConversation}
              />
              <AskJodComposer
                onSendMessage={sendMessage}
                disabled={false}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 md:p-8">
              <div className="text-center space-y-6 max-w-md">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  Welcome to Ask JOD
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Start a new conversation to get career guidance and advice from our AI assistant.
                </p>
                <Button
                  onClick={createNewConversation}
                  size="lg"
                  className="min-h-[44px]"
                >
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </main>
    </div>
  );
}