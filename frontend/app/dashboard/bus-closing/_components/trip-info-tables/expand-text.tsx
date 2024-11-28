import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract first three words
  const truncatedText = text.split(' ').slice(0, 3).join(' ');

  return (
    <div className="flex min-w-52 items-center space-x-2 whitespace-pre-wrap">
      <span className="">{isExpanded ? text : `${truncatedText}...`}</span>
      <button
        className="text-blue-500 hover:underline"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Show Less' : '...'}
      </button>
    </div>
  );
};
