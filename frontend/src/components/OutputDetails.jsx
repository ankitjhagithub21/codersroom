import { Clock, Cpu, CheckCircle, XCircle, AlertCircle, Timer } from "lucide-react";

const OutputDetails = ({ status, status_id, time, memory, isLoading }) => {
  const getStatusIcon = (status_id) => {
    switch (status_id) {
      case 3: // Accepted
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 4: // Wrong Answer
      case 5: // Runtime Error
      case 6: // Compilation Error
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 7: // Time Limit Exceeded
        return <Timer className="w-4 h-4 text-orange-500" />;
      case 12: // Memory Limit Exceeded
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status_id) => {
    switch (status_id) {
      case 3: return "text-green-600";
      case 4: 
      case 5: 
      case 6: return "text-red-600";
      case 7: return "text-orange-600";
      case 12: return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const formatTime = (time) => {
    if (!time) return "—";
    const numTime = parseFloat(time);
    if (numTime < 0.001) return "< 1ms";
    if (numTime < 1) return `${(numTime * 1000).toFixed(1)}ms`;
    return `${numTime.toFixed(3)}s`;
  };

  const formatMemory = (memory) => {
    if (!memory) return "—";
    if (memory < 1024) return `${memory} B`;
    if (memory < 1024 * 1024) return `${(memory / 1024).toFixed(1)} KB`;
    return `${(memory / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Processing...</span>
        </div>
      </div>
    );
  }

  if (!status && !time && !memory) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-3">
          {/* Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              {getStatusIcon(status_id)}
              <span className={`text-xs font-medium ${getStatusColor(status_id)}`}>
                {status || "Unknown"}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px] leading-tight">Time</span>
              <span className="text-gray-700 font-medium text-xs">
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Memory */}
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px] leading-tight">Memory</span>
              <span className="text-gray-700 font-medium text-xs">
                {formatMemory(memory)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputDetails;