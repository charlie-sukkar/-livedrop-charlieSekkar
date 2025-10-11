import React from 'react';
import { Icon } from '../atoms/Icon';

type TimelineStatus = 'Placed' | 'Packed' | 'Shipped' | 'Delivered';

interface OrderTimelineProps {
  currentStatus: string;
}

const timelineSteps: { status: TimelineStatus; label: string; description: string }[] = [
  { status: 'Placed', label: 'Order Placed', description: 'Your order has been received' },
  { status: 'Packed', label: 'Packed', description: 'Your items are being prepared' },
  { status: 'Shipped', label: 'Shipped', description: 'Your order is on the way' },
  { status: 'Delivered', label: 'Delivered', description: 'Your order has been delivered' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const currentIndex = timelineSteps.findIndex(step => step.status === currentStatus);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
      
      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${isCompleted 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 bg-white text-gray-400'
                    }
                    ${isCurrent ? 'ring-2 ring-blue-200 ring-offset-2' : ''}
                  `}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <Icon className="w-4 h-4" d="M5 13l4 4L19 7" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                {index < timelineSteps.length - 1 && (
                  <div 
                    className={`
                      flex-1 w-0.5 mt-2
                      ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}
                    `}
                    aria-hidden="true"
                  />
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <h3 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};