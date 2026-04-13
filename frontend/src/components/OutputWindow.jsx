import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import OutputDetails from "./OutputDetails.jsx";

const OutputWindow = ({ output, error, compileInfo, status, status_id, time, memory, isLoading }) => {
  const [sections, setSections] = useState({
    output: true,
    error: true,
    compileInfo: false
  });

  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    if (isLoading) return "text-yellow-600";
    if (status === "Accepted") return "text-green-600";
    if (status === "Time Limit Exceeded") return "text-orange-600";
    if (status === "Runtime Error") return "text-red-600";
    if (status === "Compilation Error") return "text-red-600";
    return "text-gray-600";
  };

  const getStatusIcon = (status) => {
    if (isLoading) return "⚡ Running...";
    if (status === "Accepted") return "✓ Success";
    if (status === "Time Limit Exceeded") return "⏱ Timeout";
    if (status === "Runtime Error") return "✗ Runtime Error";
    if (status === "Compilation Error") return "✗ Compile Error";
    return status || "Ready";
  };

  return (
    <div className="bg-gray-50 h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-gray-700 font-medium text-sm">Execution Results</span>
        </div>
        <div className={`text-sm font-medium ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Output Section */}
        {(output || isLoading) && (
          <div className="border-b border-gray-200 bg-white">
            <button
              onClick={() => toggleSection('output')}
              className="w-full px-4 py-2.5 flex items-center space-x-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {sections.output ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">Output</span>
            </button>
            {sections.output && (
              <div className="px-4 pb-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">
                    {isLoading ? "Executing code..." : output || "No output"}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div className="border-b border-gray-200 bg-white">
            <button
              onClick={() => toggleSection('error')}
              className="w-full px-4 py-2.5 flex items-center space-x-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {sections.error ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="text-sm font-medium text-red-600">Error</span>
            </button>
            {sections.error && (
              <div className="px-4 pb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <pre className="text-red-700 font-mono text-sm whitespace-pre-wrap break-words">
                    {error}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compile Info Section */}
        {compileInfo && (
          <div className="bg-white">
            <button
              onClick={() => toggleSection('compileInfo')}
              className="w-full px-4 py-2.5 flex items-center space-x-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {sections.compileInfo ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="text-sm font-medium text-yellow-600">Compilation Info</span>
            </button>
            {sections.compileInfo && (
              <div className="px-4 pb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <pre className="text-yellow-800 font-mono text-sm whitespace-pre-wrap break-words">
                    {compileInfo}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!output && !error && !compileInfo && !isLoading && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-3">💻</div>
              <p className="text-sm font-medium text-gray-600">No output yet</p>
              <p className="text-xs mt-1 text-gray-500">Click "Run Code" to see results</p>
            </div>
          </div>
        )}
      </div>

      {/* Output Details */}
      <OutputDetails
        status={status}
        status_id={status_id}
        time={time}
        memory={memory}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OutputWindow;