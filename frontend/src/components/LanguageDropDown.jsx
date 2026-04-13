

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { languageOptions } from "../constants/languageOptions";

const LanguagesDropDown = ({ onSelectChange, selectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (language) => {
    onSelectChange(language);
    setIsOpen(false);
  };

  return (
    <div className="relative w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className="text-gray-900 font-medium">{selectedLanguage.name}</span>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            {languageOptions.map((language) => (
              <button
                key={language.id}
                onClick={() => handleSelect(language)}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors ${
                  selectedLanguage.id === language.id
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-900'
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagesDropDown;