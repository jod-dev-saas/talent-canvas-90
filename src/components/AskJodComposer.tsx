/**
 * Ask JOD Composer - input-only (single-line) ChatGPT-like pill
 *
 * Notes:
 * - Uses <input /> (single-line). Shift+Enter will NOT create a newline (browser limitation).
 * - Enter (or Ctrl/Cmd+Enter) sends the message.
 */

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
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
  "Job search",
];

export function AskJodComposer({ onSendMessage, disabled = false }: AskJodComposerProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = async () => {
    if (!message.trim() || isSending || disabled) return;
    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");
      inputRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter sends (single-line input). Shift+Enter cannot create newline in <input>.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: string) => {
    const prompts: Record<string, string> = {
      "Profile tips": "How can I make my profile stand out to recruiters?",
      "Resume review": "Can you help me improve my resume?",
      "Interview prep": "What are some common interview questions I should prepare for?",
      "Career growth": "How can I advance in my current role?",
      "Skill development": "What skills should I focus on developing?",
      "Job search": "What's the best strategy for my job search?",
    };
    setMessage(prompts[reply] ?? reply);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2">
          {QUICK_REPLIES.map((reply) => (
            <motion.div key={reply} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                disabled={isSending || disabled}
                className="text-xs min-h-[36px] px-3"
                aria-label={`Quick reply: ${reply}`}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                {reply}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Input pill */}
          <div className="w-full flex justify-center px-2">
            <div className="w-full max-w-4xl">
              <div
                className="flex items-center gap-2 rounded-md bg-ba/70 ring-1 ring-ba/30 shadow-sm
                           h-10 md:h-12 px-2 md:px-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your career..."
                  disabled={isSending || disabled}
                  aria-label="Type your message"
                  className="flex-1 bg-transparent border-0 outline-none text-sm md:text-base
                             placeholder:text-muted-foreground px-2 py-1 caret-current min-w-0"
                />

                {/* Send */}
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isSending || disabled}
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9 rounded-md flex items-center justify-center shrink-0"
                  aria-label="Send message"
                >
                  {isSending ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

        <div className="text-xs text-muted-foreground text-center px-4">
          <strong>Disclaimer:</strong> JOD AI provides simulated career guidance for educational purposes only.
          All advice is general in nature and should be considered alongside professional career counseling.
        </div>
      </div>
    </div>
  );
}
