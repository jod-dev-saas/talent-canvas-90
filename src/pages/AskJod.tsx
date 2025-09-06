/**
 * Ask JOD - ChatGPT-style AI Career Assistant
 * 
 * Features:
 * - Time-based greeting on new conversations
 * - 20 hardcoded assistant messages with pattern matching
 * - Local storage for chat history (localStorage.jod_chats_v1)
 * - Export/import conversations
 * - Mobile-responsive with collapsible sidebar
 * 
 * Storage keys:
 * - localStorage.jod_chats_v1: Array of conversations
 * - localStorage.jod_role: User role (candidate/company)
 * 
 * TODO: Replace hardcoded responses with server-side LLM proxy
 * TODO: Add NEXT_PUBLIC_OPENAI_KEY for production AI integration
 */

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AskJodSidebar } from "@/components/AskJodSidebar";
import { AskJodMain } from "@/components/AskJodMain";
import { AskJodComposer } from "@/components/AskJodComposer";
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

export default function AskJod() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<'candidate' | 'company' | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Save conversations when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (conversations.length > 0) {
      try {
        localStorage.setItem('jod_chats_v1', JSON.stringify(conversations));
      } catch (error) {
        console.error('Failed to save conversations:', error);
        toast({
          title: "Storage Error",
          description: "Could not save conversation. Please check your browser storage.",
          variant: "destructive"
        });
      }
    }
  }, [conversations, toast]);

  // Auto-scroll to bottom when messages change (with reduced motion support)
  useEffect(() => {
    if (messagesEndRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      messagesEndRef.current.scrollIntoView({ 
        behavior: prefersReducedMotion ? 'auto' : 'smooth' 
      });
    }
  }, [currentConversation?.messages]);

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

  const updateConversationTitle = (conversationId: string, newTitle: string) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId 
        ? { ...c, title: newTitle, updated_at: new Date() }
        : c
    ));
    
    // Update current conversation if it matches
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(prev => prev ? { ...prev, title: newTitle, updated_at: new Date() } : null);
    }
  };

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

  const exportConversation = (conversation: Conversation) => {
    const chatText = conversation.messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'JOD'}: ${msg.text}\n`
    ).join('\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jod-chat-${conversation.id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat Exported",
      description: "Conversation downloaded as text file"
    });
  };

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 h-screen flex overflow-hidden">
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
                onExport={exportConversation}
                onDelete={deleteConversation}
              />
              <AskJodComposer
                onSendMessage={sendMessage}
                disabled={false}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center space-y-4 max-w-md">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  Welcome to Ask JOD
                </h2>
                <p className="text-muted-foreground">
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
      
      <Footer />
    </div>
  );
}