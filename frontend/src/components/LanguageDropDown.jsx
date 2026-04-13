import { useState } from "react";
import { ChevronDown } from "lucide-react";

const themeOptions = [
  { id: "vs-dark",  name: "Dark Theme"  },
  { id: "vs-light", name: "Light Theme" },
  { id: "hc-black", name: "High Contrast" },
];

const ThemeDropDown = ({ handleThemeChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTheme = themeOptions.find((o) => o.id === theme) ?? themeOptions[0];

  const handleSelect = (themeOption) => {
    handleThemeChange(themeOption.id);
    setIsOpen(false);
  };

  return (
    <div className="relative w-44">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:border-blue-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <span className="text-gray-900 font-medium text-sm">{selectedTheme.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
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
                className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors text-sm ${
                  selectedTheme.id === themeOption.id
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border-l-2 border-blue-500"
                    : "text-gray-700"
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