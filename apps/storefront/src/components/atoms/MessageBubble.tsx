import React from 'react';

interface MessageBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: string;
  citation?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUser = false, 
  timestamp,
  citation 
}) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`
          max-w-xs lg:max-w-md px-4 py-2 rounded-lg
          ${isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
          }
        `}
        role="text"
        aria-label={`${isUser ? 'You' : 'Support'} said: ${message}`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        
        {(timestamp || citation) && (
          <div className={`flex justify-between items-center mt-1 text-xs ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {timestamp && <span>{timestamp}</span>}
            {citation && (
              <span className="ml-2 bg-black bg-opacity-20 px-1 rounded">
                {citation}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};