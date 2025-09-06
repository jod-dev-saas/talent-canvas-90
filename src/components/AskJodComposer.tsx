/**
 * Ask JOD Message Composer - Input area with quick replies
 * 
 * Features:
 * - Multiline text input with Enter to send, Shift+Enter for newline
 * - Quick reply buttons for common prompts
 * - Mic icon (UI only) for future voice input
 * - Auto-resize textarea
 * - Send button with loading state
 * 
 * TODO: Add voice input functionality with speech-to-text
 * TODO: Add file upload for resume/document analysis
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Mic, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AskJodComposerProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

const QUICK_REPLIES = [
  "Profile tips",
  "Resume review", 
  "Interview prep",
  "Career growth",
  "Skill development",
  "Job search"
];

export function AskJodComposer({ onSendMessage, disabled = false }: AskJodComposerProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(message);
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: string) => {
    const prompts = {
      "Profile tips": "How can I make my profile stand out to recruiters?",
      "Resume review": "Can you help me improve my resume?",
      "Interview prep": "What are some common interview questions I should prepare for?",
      "Career growth": "How can I advance in my current role?", 
      "Skill development": "What skills should I focus on developing?",
      "Job search": "What's the best strategy for my job search?"
    };
    
    setMessage(prompts[reply as keyof typeof prompts] || reply);
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2">
          {QUICK_REPLIES.map((reply) => (
            <motion.div
              key={reply}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                disabled={isSending || disabled}
                className="text-xs"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                {reply}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <Card className="p-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about your career... (Press Enter to send, Shift+Enter for new line)"
                className="min-h-[44px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 p-0"
                disabled={isSending || disabled}
              />
            </div>

            <div className="flex gap-2">
              {/* Mic Button (UI only) */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10"
                disabled={true} // TODO: Enable when voice input is implemented
                title="Voice input (coming soon)"
              >
                <Mic className="h-4 w-4" />
              </Button>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!message.trim() || isSending || disabled}
                size="sm"
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-xs text-muted-foreground text-center">
          JOD AI can make mistakes. All advice is for educational purposes only.
        </div>
      </div>
    </div>
  );
}