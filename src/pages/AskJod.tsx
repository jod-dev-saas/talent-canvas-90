/**
 * Ask JOD Page - AI Career Assistant with persona selection
 * 
 * Provides persona-driven career guidance with mock AI responses
 * TODO: Replace mock responses with real AI integration
 */

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Download, ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAS, type Persona, getAllPersonas } from "@/lib/chat-personas";
import { generateMockResponse, CONVERSATION_STARTERS, generateSearchPrompt, type MockChatMessage } from "@/lib/ask-jod-mock";

export default function AskJod() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<MockChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [role, setRole] = useState<'candidate' | 'company' | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const { toast } = useToast();

  // Get user role from localStorage on mount
  useEffect(() => {
    const userRole = localStorage.getItem('jod_role') as 'candidate' | 'company' | null;
    setRole(userRole);

    // Auto-select appropriate persona for companies
    if (userRole === 'company') {
      setSelectedPersona(PERSONAS['hiring-advisor']);
    }
  }, []);

  // Load saved conversation from localStorage
  useEffect(() => {
    if (selectedPersona) {
      const savedMessages = localStorage.getItem(`jod_chat_${selectedPersona.id}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Start with welcome message
        const welcomeMessage: MockChatMessage = {
          id: Date.now().toString(),
          content: `Hi! I'm your ${selectedPersona.title}. ${selectedPersona.disclaimer}\n\nI'm here to help with ${selectedPersona.field.toLowerCase()} questions. What would you like to know?`,
          sender: 'bot',
          timestamp: new Date(),
          persona: selectedPersona.id
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [selectedPersona]);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (selectedPersona && messages.length > 0) {
      localStorage.setItem(`jod_chat_${selectedPersona.id}`, JSON.stringify(messages));
    }
  }, [messages, selectedPersona]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedPersona) return;

    const userMessage: MockChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateMockResponse(currentMessage, selectedPersona.id);
      
      const botMessage: MockChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        persona: selectedPersona.id
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500); // Realistic response time
  };

  const handleStarterQuestion = (question: string) => {
    setCurrentMessage(question);
  };

  const handleExportChat = () => {
    if (!selectedPersona || messages.length === 0) return;

    const chatText = messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : selectedPersona.name}: ${msg.content}\n`
    ).join('\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jod-chat-${selectedPersona.id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat Exported",
      description: "Your conversation has been downloaded as a text file."
    });
  };

  const handleGenerateSearchPrompt = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Job Description",
        description: "Please enter a job description to generate a search prompt.",
        variant: "destructive"
      });
      return;
    }

    const searchPrompt = generateSearchPrompt(jobDescription);
    
    // Add as a bot message
    const botMessage: MockChatMessage = {
      id: Date.now().toString(),
      content: `Based on your job description, here's an optimized search prompt:\n\n"${searchPrompt}"\n\nYou can use this in the company browser to find candidates with the right skills and experience.`,
      sender: 'bot',
      timestamp: new Date(),
      persona: 'hiring-advisor'
    };

    setMessages(prev => [...prev, botMessage]);
    setJobDescription("");
  };

  const availablePersonas = getAllPersonas().filter(p => {
    if (role === 'company') return p.id === 'hiring-advisor';
    if (role === 'candidate') return p.id !== 'hiring-advisor';
    return true; // Show all if no role selected
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {!selectedPersona ? (
            /* Persona Selection */
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Ask JOD <Sparkles className="inline h-8 w-8 text-primary ml-2" />
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Get personalized career guidance from AI-powered mentors. Choose your specialist 
                  to receive expert advice tailored to your field and experience level.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availablePersonas.map((persona, index) => (
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary"
                      onClick={() => setSelectedPersona(persona)}
                    >
                      <CardHeader className="text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/5">
                          <div className="w-full h-full flex items-center justify-center">
                            <Bot className="h-8 w-8 text-primary" />
                          </div>
                        </Avatar>
                        <CardTitle className="text-lg">{persona.name}</CardTitle>
                        <CardDescription className="text-primary font-medium">
                          {persona.title}
                        </CardDescription>
                        <Badge variant="secondary">{persona.field}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {persona.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-foreground">Sample Questions:</div>
                          <div className="space-y-1">
                            {persona.sampleQuestions.slice(0, 2).map((question, idx) => (
                              <div key={idx} className="text-xs text-muted-foreground">
                                • {question}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Start Conversation
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
              {/* Sidebar - Persona Info & Tools */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="pb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedPersona(null);
                        setMessages([]);
                      }}
                      className="mb-4"
                    >
                      ← Back to Mentors
                    </Button>
                    
                    <div className="text-center">
                      <Avatar className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-primary/5">
                        <Bot className="h-6 w-6 text-primary" />
                      </Avatar>
                      <CardTitle className="text-lg">{selectedPersona.name}</CardTitle>
                      <CardDescription>{selectedPersona.title}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Expertise</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedPersona.expertise.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {selectedPersona.disclaimer}
                    </div>

                    <Button size="sm" variant="outline" onClick={handleExportChat} className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Export Chat
                    </Button>
                  </CardContent>
                </Card>

                {/* Conversation Starters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Start</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {CONVERSATION_STARTERS[selectedPersona.id]?.map((starter, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-3 text-xs leading-relaxed"
                        onClick={() => handleStarterQuestion(starter)}
                      >
                        "{starter}"
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Company-specific tool */}
                {selectedPersona.id === 'hiring-advisor' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Search Prompt Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        placeholder="Paste job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={4}
                        className="text-xs"
                      />
                      <Button size="sm" onClick={handleGenerateSearchPrompt} className="w-full">
                        Generate Search Prompt
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Chat Panel */}
              <div className="lg:col-span-3 flex flex-col">
                <Card className="flex-1 flex flex-col">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">
                      Conversation with {selectedPersona.name}
                    </CardTitle>
                  </CardHeader>
                  
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${
                              message.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.sender === 'bot' && (
                              <Avatar className="w-8 h-8 bg-primary/10 flex-shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                              </Avatar>
                            )}
                            
                            <div className={`max-w-[80%] ${
                              message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            } rounded-lg p-3`}>
                              <div className="text-sm whitespace-pre-line leading-relaxed">
                                {message.content}
                              </div>
                              <div className="text-xs opacity-70 mt-2">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>

                            {message.sender === 'user' && (
                              <Avatar className="w-8 h-8 bg-secondary flex-shrink-0">
                                <User className="h-4 w-4" />
                              </Avatar>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3 justify-start"
                        >
                          <Avatar className="w-8 h-8 bg-primary/10 flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </Avatar>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" />
                              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse delay-100" />
                              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse delay-200" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask me anything about your career..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isTyping}
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Press Enter to send • Shift+Enter for new line
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}