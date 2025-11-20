'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Loader2 } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  onNewChat,
  isLoading = false,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">AI Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Ask me anything about ARC blockchain
          </p>
        </div>
        <Button
          onClick={onNewChat}
          variant="outline"
          size="sm"
          disabled={isLoading || messages.length === 0}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 max-w-md text-center">
              <h3 className="text-lg font-semibold mb-2">
                Welcome to ARC AI Assistant
              </h3>
              <p className="text-muted-foreground">
                I'm here to help you with questions about ARC blockchain,
                smart contracts, DApps, and development. Ask me anything!
              </p>
            </Card>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                </div>
                <div className="flex flex-col">
                  <div className="rounded-lg px-4 py-2 bg-muted text-foreground">
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
