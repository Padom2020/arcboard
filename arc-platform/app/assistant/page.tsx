'use client';

import { useState } from 'react';
import { ChatInterface, ChatMessage } from '@/components/chat';
import { useToast } from '@/components/ui/toast';

export default function AssistantPage() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message to the conversation
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call the chat API with streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let assistantContent = '';
      const assistantMessageId = `assistant-${Date.now()}`;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.error) {
                throw new Error(parsed.error);
              }

              if (parsed.content) {
                assistantContent += parsed.content;
                
                // Update the assistant message in real-time
                setMessages((prev) => {
                  const existingIndex = prev.findIndex(
                    (msg) => msg.id === assistantMessageId
                  );

                  const assistantMessage: ChatMessage = {
                    id: assistantMessageId,
                    role: 'assistant',
                    content: assistantContent,
                    timestamp: new Date(),
                  };

                  if (existingIndex >= 0) {
                    const newMessages = [...prev];
                    newMessages[existingIndex] = assistantMessage;
                    return newMessages;
                  } else {
                    return [...prev, assistantMessage];
                  }
                });
              }
            } catch (e) {
              // Skip invalid JSON
              console.error('Failed to parse chunk:', e);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      addToast({
        title: 'Error',
        description: error.message || 'Failed to get response from AI assistant',
        variant: 'error',
      });
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)]">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        isLoading={isLoading}
      />
    </div>
  );
}
