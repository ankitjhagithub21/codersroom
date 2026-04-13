import { useState } from "react";
import { ChevronDown } from "lucide-react";

const themeOptions = [
  { id: "vs-dark", name: "VS Dark" },
  { id: "vs-light", name: "VS Light" },
  { id: "hc-black", name: "HC Black" }
];

const ThemeDropDown = ({ handleThemeChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    themeOptions.find(option => option.id === theme) || themeOptions[0]
  );

  const handleSelect = (themeOption) => {
    setSelectedTheme(themeOption);
    handleThemeChange({ target: { value: themeOption.id } });
    setIsOpen(false);
  };

  return (
    <div className="relative w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className="text-gray-900 font-medium">{selectedTheme.name}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            {themeOptions.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => handleSelect(themeOption)}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors ${
                  selectedTheme.id === themeOption.id
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-900'
                }`}
              >
                {themeOption.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeDropDown;
