import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract first three words
  const truncatedText = text.split(' ').slice(0, 3).join(' ');

  return (
    <div className="whitespace-pre-wrap flex items-center space-x-2 min-w-52">
      <span className="">
        {isExpanded ? text : `${truncatedText}...`}
      </span>
      <button
        className="text-blue-500 hover:underline"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Show Less' : '...'}
      </button>
    </div>
  );
};
