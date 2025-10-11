import React, { useEffect, useRef } from 'react';
import { PanelHeader } from '../molecules/PanelHeader';
import { SupportChat } from '../molecules/SupportChat';
import { Icon } from '../atoms/Icon';

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

   const handleTabKey = (e: KeyboardEvent) => {
  if (!isOpen || !panelRef.current) return;

  const focusable = Array.from(
    panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === first || !panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  }
};

    if (isOpen && panelRef.current) {
      const firstFocusableElement = panelRef.current.querySelector(
        'input, button, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusableElement?.focus();
    }

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, onClose]);



  if (!isOpen) return null;

  return (
    <>
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-label="Support assistant"
      >
       
        <PanelHeader
          title="Support Assistant"
          onClose={onClose}
          variant="support"
          icon={
            <Icon
              className="h-6 w-6 text-white"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
          }
        />


        <div className="flex-1 overflow-y-auto px-4">
          <SupportChat />
        </div>
      </div>
    </>
  );
};