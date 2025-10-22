// apps/storefront/src/pages/SupportAssistantPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { sendMessageToAssistant } from '../lib/api';
import { useUser } from '../contexts/UserContext';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  citations?: string[];
  intent?: string;
}

export const SupportAssistantPage: React.FC = () => {
  const { customer } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m your support assistant. How can I help you with your order today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantOnline, setAssistantOnline] = useState(true);
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
    
    // Add user message to chat
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      // Call your backend assistant
      
      const response = await sendMessageToAssistant(
  userMessage,
  customer?.email,    // ← ADD user email
  customer?._id        // ← ADD user ID
);

      if (response.success) {
        // Add AI response to chat
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: response.data.text, // The AI's answer
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: response.data.citations,
          intent: response.data.intent
        };

        setMessages(prev => [...prev, botMessage]);
        setAssistantOnline(true);
      } else {
        throw new Error(response.error || 'Failed to get response from assistant');
      }
    } catch (error) {
      console.error('Assistant error:', error);
      
      // Show error message to user
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Sorry, I\'m having trouble connecting to the assistant service. Please try again in a moment.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setAssistantOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Support Assistant</h1>
                <p className="text-blue-100 mt-1">Get help with your orders and account</p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                assistantOnline ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${assistantOnline ? 'bg-green-200' : 'bg-red-200'}`}></div>
                {assistantOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex flex-col h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    
                    {/* Show citations if available */}
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Related resources:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.citations.map((citation, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none max-w-[80%]">
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

            {/* Input Area */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about tracking, returns, shipping..."
                  disabled={isLoading || !assistantOnline}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || !assistantOnline}
                  size="lg"
                >
                  Send
                </Button>
              </form>
              
              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(' track my order [ordId]')}
                  disabled={isLoading || !assistantOnline}
                >
                  Track order
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion('What is your return policy?')}
                  disabled={isLoading || !assistantOnline}
                >
                  policy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion('show me my recent orders?')}
                  disabled={isLoading || !assistantOnline}
                >
                  recent orders
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion('looking for ... ')}
                  disabled={isLoading || !assistantOnline}
                >
                  search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAssistantPage;