/**
 * Ask JOD Sidebar - Chat history and navigation
 *
 * - Toggle button now always toggles the sidebar open/close.
 * - Mobile sheet is controlled via isOpen/onToggle props so state stays in sync.
 * - Selecting a conversation closes the sheet on small screens (desktop unchanged).
 */

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Menu,
  Trash2,
  Download,
  Upload,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import { Conversation } from "@/pages/AskJod";
import { formatDistanceToNow } from "date-fns";

interface AskJodSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  onExportAll: () => void;
  onImport: (file: File) => void;
}

export function AskJodSidebar({
  conversations,
  currentConversation,
  isOpen,
  onToggle,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onClearAll,
  onExportAll,
  onImport,
}: AskJodSidebarProps) {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
    // on mobile we can close the sheet after opening file picker (optional)
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      onToggle();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = ""; // Reset input
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    onSelectConversation(conversation);
    // Close on mobile for better UX
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      onToggle();
    }
  };

  const handleNewChat = () => {
    onNewChat();
    // Close on mobile so user sees chat area
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      onToggle();
    }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Ask JOD</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportAll}>
                <Download className="mr-2 h-4 w-4" />
                Export All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import Chats
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowClearDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          onClick={handleNewChat}
          className="w-full min-h-[44px]"
          size="sm"
          aria-label="Start new conversation"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer transition-all hover:bg-accent ${
                  currentConversation?.id === conversation.id ? "bg-accent border-primary" : ""
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <h3 className="text-sm font-medium truncate">{conversation.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(conversation.updated_at, { addSuffix: true })}
                    </p>
                    {conversation.messages.length > 1 && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {conversation.messages[conversation.messages.length - 1]?.text}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      // prevent the trigger click from bubbling to Card's onClick
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />

      {/* Clear All Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Conversations?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your chat history will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearAll();
                setShowClearDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (controlled width) */}
      <div
        className={`hidden lg:flex flex-col bg-background border-r transition-all duration-300 ${
          isOpen ? "w-80" : "w-0"
        } overflow-hidden`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sheet (controlled) */}
      <Sheet open={isOpen} onOpenChange={() => onToggle()}>
        {/* Toggle button for mobile — always visible; toggles open/close */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden fixed top-20 left-4 z-50"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close chat sidebar" : "Open chat sidebar"}
          onClick={() => onToggle()}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Toggle Button — always visible on desktop; toggles open/close */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle()}
        className="hidden lg:flex fixed top-20 left-4 z-50"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat sidebar" : "Open chat sidebar"}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}
