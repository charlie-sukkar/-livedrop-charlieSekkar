import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
  variant?: 'cart' | 'support';
  icon?: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  onClose,
  variant = 'cart',
  icon,
}) => {
  const isSupport = variant === 'support';
  const bgColor = isSupport ? 'bg-blue-600 text-white' : 'bg-white text-gray-900';
  const closeButtonClass = isSupport
    ? 'text-white hover:bg-blue-700 focus:ring-white'
    : 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300';

  return (
    <div className={`flex items-center justify-between p-4 border-b ${bgColor}`}>
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label={`Close ${variant} panel`}
        className={closeButtonClass}
      >
        <Icon className="h-6 w-6" d="M6 18L18 6M6 6l12 12" />
      </Button>
    </div>
  );
};