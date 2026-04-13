import { useState } from "react";
import { Play } from "lucide-react";

const CompileRunButton = ({ 
  onCompileRun, 
  isLoading, 
  disabled = false,
  language,
  code 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!disabled && !isLoading) {
      onCompileRun();
    }
  };

  const getButtonStyles = () => {
    if (disabled) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300";
    }
    if (isLoading) {
      return "bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent";
    }
    if (isHovered) {
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent shadow-md transform scale-105";
    }
    return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent hover:shadow-md";
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        px-5 py-2 rounded-lg font-medium transition-all duration-200
        flex items-center space-x-2 min-w-[110px] justify-center
        border text-sm
        ${getButtonStyles()}
      `}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Running</span>
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          <span>Run Code</span>
        </>
      )}
    </button>
  );
};

export default CompileRunButton;