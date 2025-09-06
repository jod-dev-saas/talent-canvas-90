/**
 * Ask JOD Main Chat Panel - Message display and conversation header
 * 
 * Features:
 * - Scrollable message list with user/assistant bubbles
 * - Editable conversation title
 * - Export and delete conversation controls
 * - Role badge display
 * - Auto-scroll to bottom on new messages
 * 
 * TODO: Add message search and filtering
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, Trash2, Edit2, Check, X, Bot, User } from "lucide-react";
import { Conversation } from "@/pages/AskJod";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
interface AskJodMainProps {
  conversation: Conversation;
  userRole: 'candidate' | 'company' | null;
  onUpdateTitle: (conversationId: string, newTitle: string) => void;
  onExportPDF: (conversation: Conversation) => void;
  onDelete: (conversationId: string) => void;
}
export function AskJodMain({
  conversation,
  userRole,
  onUpdateTitle,
  onExportPDF,
  onDelete
}: AskJodMainProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(conversation.title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Update title value when conversation changes
  useEffect(() => {
    setTitleValue(conversation.title);
  }, [conversation.title]);

  // Auto-scroll to bottom when messages change
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
  }, [conversation.messages]);
  const handleSaveTitle = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== conversation.title) {
      onUpdateTitle(conversation.id, trimmed);
    }
    setIsEditingTitle(false);
  };
  const handleCancelEdit = () => {
    setTitleValue(conversation.title);
    setIsEditingTitle(false);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  const handleTitleClick = () => {
    setIsEditingTitle(true);
    // Focus the input after state update
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 10);
  };
  return <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isEditingTitle ? <div className="flex items-center gap-2 flex-1">
                <Input ref={titleInputRef} value={titleValue} onChange={e => setTitleValue(e.target.value)} onKeyDown={handleKeyPress} onBlur={handleSaveTitle} className="flex-1" aria-label="Edit conversation title" />
                <Button size="sm" variant="ghost" onClick={handleSaveTitle} aria-label="Save title">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit} aria-label="Cancel edit">
                  <X className="h-4 w-4" />
                </Button>
              </div> : <div className="flex items-center gap-2 flex-1 min-w-0">
                <h1 onClick={handleTitleClick} title="Click to edit title" className="text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors mx-[50px]">
                  {conversation.title}
                </h1>
              </div>}
          </div>

          <div className="flex items-center gap-2">
            {userRole && <Badge variant="secondary">
                {userRole === 'candidate' ? 'Candidate' : 'Company'}
              </Badge>}
            
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(conversation.updated_at, {
              addSuffix: true
            })}
            </div>

            <Button size="sm" variant="ghost" onClick={() => onExportPDF(conversation)} title="Export as PDF" aria-label="Export conversation as PDF">
              <Download className="h-4 w-4" />
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" title="Delete conversation" aria-label="Delete conversation">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The conversation will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                  onDelete(conversation.id);
                  setShowDeleteDialog(false);
                }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="px-6 md:px-8 py-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {conversation.messages.map((message, index) => <motion.div key={message.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: index * 0.05
          }} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>}

                <div className={`max-w-[80%] lg:max-w-[70%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-2xl px-4 py-3 mb-1`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </div>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                  </div>
                </div>

                {message.role === 'user' && <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>}
              </motion.div>)}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>;
}