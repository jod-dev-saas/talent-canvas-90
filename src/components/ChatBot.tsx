"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { chatFlow, ChatMessage, ChatOption } from "@/lib/chatFlow";

/**
 * AI Chatbot component with hardcoded conversation flow
 * Appears as floating bubble, opens into accessible modal
 * Handles candidate and company conversation paths
 * Includes form submission for demo requests
 */
export function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFlow, setCurrentFlow] = useState("greeting");
  const [userInput, setUserInput] = useState("");
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoForm, setDemoForm] = useState({
    companyName: "",
    email: "",
    message: ""
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("greeting");
    }
  }, [isOpen, messages.length]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Add bot message based on flow key
  const addBotMessage = (flowKey: string) => {
    const flow = chatFlow[flowKey];
    if (!flow) return;

    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: flow.message,
      isBot: true,
      timestamp: new Date(),
      options: flow.options,
      showForm: flow.showForm
    };

    setMessages(prev => [...prev, botMessage]);
    setCurrentFlow(flowKey);
    
    if (flow.showForm) {
      setShowDemoForm(true);
    }
  };

  // Handle option selection
  const handleOptionClick = (option: ChatOption) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString() + "_user",
      text: option.text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Handle different option types
    if (option.navigateTo) {
      navigate(option.navigateTo);
      setIsOpen(false);
      return;
    }

    if (option.externalUrl) {
      window.open(option.externalUrl, "_blank");
      return;
    }

    if (option.nextAction) {
      setTimeout(() => addBotMessage(option.nextAction!), 500);
    }
  };

  // Handle free text input (fallback)
  const handleTextSubmit = () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + "_user",
      text: userInput,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput("");

    // Simple keyword matching for help
    const input = userInput.toLowerCase();
    if (input.includes("help") || input.includes("?")) {
      setTimeout(() => addBotMessage("help"), 500);
    } else {
      setTimeout(() => addBotMessage("fallback"), 500);
    }
  };

  // Handle demo form submission
  const handleDemoSubmit = async () => {
    if (!demoForm.companyName || !demoForm.email) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // TODO: Replace with actual Supabase insert when ready
      console.log("Demo request submitted:", demoForm);
      
      toast({
        title: "Demo request submitted!",
        description: "We'll contact you within 24 hours."
      });

      setShowDemoForm(false);
      setDemoForm({ companyName: "", email: "", message: "" });
      
      // Add success message
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Thanks! Your demo request has been submitted. We'll be in touch soon.",
        isBot: true,
        timestamp: new Date(),
        options: [
          { id: "back_main", text: "Back to menu", nextAction: "greeting" }
        ]
      };
      setMessages(prev => [...prev, successMessage]);
      
    } catch (error) {
      toast({
        title: "Error submitting request",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter" && !e.shiftKey && userInput.trim()) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  // Respect reduced motion preference
  const reduceMotion = typeof window !== "undefined" && 
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={() => setIsOpen(true)}
        whileHover={reduceMotion ? {} : { scale: 1.05 }}
        whileTap={reduceMotion ? {} : { scale: 0.95 }}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6 mx-auto" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Chat Panel */}
            <motion.div
              ref={modalRef}
              className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-card border border-border rounded-lg shadow-2xl z-50 flex flex-col focus:outline-none"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
              tabIndex={-1}
              role="dialog"
              aria-labelledby="chat-title"
              aria-describedby="chat-description"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 id="chat-title" className="font-semibold text-card-foreground">
                    TalentCanvas Assistant
                  </h2>
                  <p id="chat-description" className="text-sm text-muted-foreground">
                    How can I help you?
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isBot
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </span>
                      
                      {/* Bot Options */}
                      {message.isBot && message.options && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs"
                              onClick={() => handleOptionClick(option)}
                            >
                              {option.text}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Demo Form */}
                {showDemoForm && (
                  <Card className="max-w-full">
                    <CardContent className="p-4 space-y-4">
                      <h3 className="font-semibold text-sm">Request Demo</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="company-name" className="text-xs">
                            Company Name *
                          </Label>
                          <Input
                            id="company-name"
                            value={demoForm.companyName}
                            onChange={(e) => setDemoForm(prev => ({
                              ...prev, 
                              companyName: e.target.value
                            }))}
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="demo-email" className="text-xs">
                            Email *
                          </Label>
                          <Input
                            id="demo-email"
                            type="email"
                            value={demoForm.email}
                            onChange={(e) => setDemoForm(prev => ({
                              ...prev, 
                              email: e.target.value
                            }))}
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="demo-message" className="text-xs">
                            Message (optional)
                          </Label>
                          <Textarea
                            id="demo-message"
                            rows={2}
                            value={demoForm.message}
                            onChange={(e) => setDemoForm(prev => ({
                              ...prev, 
                              message: e.target.value
                            }))}
                            className="text-xs"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={handleDemoSubmit}
                          className="w-full text-xs"
                        >
                          Submit Request
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Text Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm"
                    aria-label="Type your message"
                  />
                  <Button
                    size="sm"
                    onClick={handleTextSubmit}
                    disabled={!userInput.trim()}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use the buttons above or type your question
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}