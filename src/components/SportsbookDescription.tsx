import React, { useState } from 'react';

interface SportsbookDescriptionProps {
  description: string;
  maxLength?: number;
}

const SportsbookDescription: React.FC<SportsbookDescriptionProps> = ({
  description,
  maxLength = 150
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowButton = description.length > maxLength;
  const displayText = isExpanded ? description : `${description.slice(0, maxLength)}...`;

  return (
    <div className="relative">
      <p className="text-gray-700">
        {displayText}
        {shouldShowButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </p>
    </div>
  );
};

export default SportsbookDescription;
