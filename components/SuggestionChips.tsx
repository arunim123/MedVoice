
import React from 'react';

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const SUGGESTIONS = [
  "Find a Dermatologist",
  "I have a severe headache",
  "Cost of full body checkup?",
  "Book Dr. Sarah Chen"
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect }) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
      {SUGGESTIONS.map((text, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(text)}
          className="bg-white border border-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md transition-all whitespace-nowrap"
        >
          {text}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
