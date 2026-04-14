import { useState } from "react";
import { Terminal, ChevronDown, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";

const CustomInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter your program input here...",
  disabled = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inputHistory, setInputHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        setInputHistory(prev => [...prev, value]);
        setHistoryIndex(-1);
      }
    }
    
    // Navigate history with arrow keys
    if (e.key === 'ArrowUp' && inputHistory.length > 0) {
      e.preventDefault();
      const newIndex = historyIndex < inputHistory.length - 1 ? historyIndex + 1 : historyIndex;
      if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        onChange(inputHistory[inputHistory.length - 1 - newIndex]);
      }
    }
    
    if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        onChange(inputHistory[inputHistory.length - 1 - newIndex]);
      } else {
        onChange('');
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setHistoryIndex(-1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
    }`}>
      {/* Header */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <Terminal className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Custom Input</span>
          {value && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {value.length} chars
            </span>
          )}
        </button>
        
        <div className="flex items-center space-x-1">
         
          
          {value && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Clear input"
            >
              <X className="h-3.5 w-3.5 text-gray-500" />
            </button>
          )}
          
          <button
            onClick={toggleFullscreen}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={isFullscreen ? 20 : 4}
            className={`
              w-full font-mono text-sm rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              outline-none transition-all resize-none p-3
              ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
            `}
            style={{
              minHeight: isFullscreen ? '400px' : '100px',
            }}
          />
          
          {/* Footer Info */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd>
                <span className="ml-1">to submit</span>
              </span>
              {inputHistory.length > 0 && (
                <span className="flex items-center space-x-1">
                  <span>•</span>
                  <span>{inputHistory.length} inputs in history</span>
                  <span>•</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">↓</kbd>
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              {value.split('\n').length} line{value.split('\n').length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Input Preview (shows how the program will receive it) */}
          {value && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Input Preview</span>
               
              </div>
              <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                {value}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomInput;