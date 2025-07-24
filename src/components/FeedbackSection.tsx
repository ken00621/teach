import React from 'react';
import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface FeedbackSectionProps {
  title: string;
  content: string;
  type: 'correct' | 'mistake' | 'advice';
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  title,
  content,
  type
}) => {
  const getConfig = () => {
    switch (type) {
      case 'correct':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800'
        };
      case 'mistake':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          iconColor: 'text-orange-600',
          titleColor: 'text-orange-800'
        };
      case 'advice':
        return {
          icon: Lightbulb,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  if (!content) return null;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
        <div>
          <h4 className={`font-semibold ${config.titleColor} mb-2`}>{title}</h4>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
};