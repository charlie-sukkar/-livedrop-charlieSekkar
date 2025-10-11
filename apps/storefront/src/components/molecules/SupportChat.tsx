import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { MessageBubble } from '../atoms/MessageBubble';
import { processUserQuery } from '../../assistant/engine';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  citation?: string;
}

export const SupportChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m your support assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
 
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      const response = await processUserQuery(userMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.answer,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: response.citation
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message.message}
            isUser={message.isUser}
            timestamp={message.timestamp}
            citation={message.citation}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question here..."
            disabled={isLoading}
            className="flex-1"
            aria-label="Type your support question"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};