import CodeEditorWindow from "./components/CodeEditorWindow";
import LanguagesDropDown from "./components/LanguageDropDown";
import ThemeDropDown from "./components/ThemeDropDown";
import OutputWindow from "./components/OutputWindow";
import CompileRunButton from "./components/CompileRunButton";
import { useState, useEffect } from "react";
import { languageOptions } from "./constants/languageOptions";
import { socket } from "./lib/socket";
import { useCallback, useRef } from "react";
import { debounce } from "lodash";
import { Code2, Users } from "lucide-react";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [code, setCode] = useState("");
  
  // Compilation state
  const [isCompiling, setIsCompiling] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [compileInfo, setCompileInfo] = useState("");
  const [status, setStatus] = useState("");
  const [statusId, setStatusId] = useState(0);
  const [executionTime, setExecutionTime] = useState("");
  const [memoryUsage, setMemoryUsage] = useState(0);
  
  const isTyping = useRef(false);
  const typingTimeout = useRef(null);

  // Normalize: accept the theme string directly (not a synthetic event)
  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    socket.emit("theme-update", { theme: themeId });
  };

  // Create debounced emitter once (not inside render)
  const emitCodeUpdate = useCallback(
    debounce((value) => {
      socket.emit("code-update", { code: value });
    }, 300), // wait 300ms after user stops typing
    [],
  );

  const handleCodeChange = (value) => {
    isTyping.current = true;
    setCode(value);
    emitCodeUpdate(value);

    // Reset typing flag after inactivity
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      isTyping.current = false;
    }, 500);
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    socket.emit("language-update", { language: value });
  };

  const handleCompileRun = async () => {
    if (!code.trim()) {
      setError("Please enter some code to run");
      return;
    }

    setIsCompiling(true);
    setError("");
    setOutput("");
    setCompileInfo("");
    setStatus("Running...");

    // Emit compile start to other clients
    socket.emit("compile-start", { 
      language: selectedLanguage.id,
      code: code.substring(0, 100) + "..." // Send truncated code for notification
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_SOCKET_URL}/api/judge/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language_id: selectedLanguage.id,
          source_code: code,
          stdin: ""
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.data.output);
        setError(result.data.error);
        setCompileInfo(result.data.compile_info);
        setStatus(result.data.status);
        setStatusId(result.data.status_id);
        setExecutionTime(result.data.time);
        setMemoryUsage(result.data.memory);
        
        // Emit result to other clients
        socket.emit("compile-result", {
          success: true,
          data: result.data
        });
      } else {
        setError(result.message || "Compilation failed");
        setStatus("Error");
        setStatusId(0);
        setExecutionTime("");
        setMemoryUsage(0);
        
        socket.emit("compile-result", {
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      setError("Network error: " + error.message);
      setStatus("Error");
      setStatusId(0);
      setExecutionTime("");
      setMemoryUsage(0);
      
      socket.emit("compile-result", {
        success: false,
        message: "Network error: " + error.message
      });
    } finally {
      setIsCompiling(false);
    }
  };

  useEffect(() => {
    socket.connect();

    const handleLanguageUpdate = (data) => setSelectedLanguage(data.language);
    const handleCodeUpdate = (data) => {
      if (!isTyping.current) {   // only apply remote update if YOU are not typing
        setCode(data.code);
      }
    };
    const handleThemeUpdate = (data) => setSelectedTheme(data.theme);
    const handleCompileStart = (data) => {
      setIsCompiling(true);
      setOutput("");
      setError("");
      setCompileInfo("");
      setStatus("Someone is running code...");
    };
    const handleCompileResult = (data) => {
      setIsCompiling(false);
      if (data.success) {
        setOutput(data.data.output);
        setError(data.data.error);
        setCompileInfo(data.data.compile_info);
        setStatus(data.data.status);
        setStatusId(data.data.status_id);
        setExecutionTime(data.data.time);
        setMemoryUsage(data.data.memory);
      } else {
        setError(data.message);
        setStatus("Error");
        setStatusId(0);
        setExecutionTime("");
        setMemoryUsage(0);
      }
    };

    socket.on("code-update", handleCodeUpdate);
    socket.on("language-update", handleLanguageUpdate);
    socket.on("theme-update", handleThemeUpdate);
    socket.on("compile-start", handleCompileStart);
    socket.on("compile-result", handleCompileResult);

    return () => {
      socket.off("code-update", handleCodeUpdate);
      socket.off("language-update", handleLanguageUpdate);
      socket.off("theme-update", handleThemeUpdate);
      socket.off("compile-start", handleCompileStart);
      socket.off("compile-result", handleCompileResult);
      socket.disconnect();
    };
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CodersRoom
              </h1>
            </div>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span className="text-sm">Collaborative Editor</span>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <nav className="flex items-center gap-3">
            <LanguagesDropDown
              onSelectChange={handleLanguageChange}
              selectedLanguage={selectedLanguage}
            />
            <ThemeDropDown
              handleThemeChange={handleThemeChange}
              theme={selectedTheme}
            />
            <CompileRunButton
              onCompileRun={handleCompileRun}
              isLoading={isCompiling}
              disabled={!code.trim()}
              language={selectedLanguage}
              code={code}
            />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Editor Section */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Code Editor</span>
          </div>
          <CodeEditorWindow
            language={selectedLanguage.value}
            theme={selectedTheme}
            code={code}
            onChange={handleCodeChange}
          />
        </div>
        
        {/* Output Section */}
        <div className="w-[450px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex flex-col">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Output Console</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <OutputWindow
              output={output}
              error={error}
              compileInfo={compileInfo}
              status={status}
              status_id={statusId}
              time={executionTime}
              memory={memoryUsage}
              isLoading={isCompiling}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;