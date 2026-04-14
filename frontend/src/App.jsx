import CodeEditorWindow from "./components/CodeEditorWindow";
import LanguagesDropDown from "./components/LanguageDropDown";
import ThemeDropDown from "./components/ThemeDropDown";
import OutputWindow from "./components/OutputWindow";
import CompileRunButton from "./components/CompileRunButton";
import RoomEntry from "./components/RoomEntry";
import { useState, useEffect } from "react";
import { languageOptions } from "./constants/languageOptions";
import { socket } from "./lib/socket";
import { useCallback, useRef } from "react";
import { debounce } from "lodash";
import { Code2, Users, Copy, Check, LogOut } from "lucide-react";
import CustomInput from "./components/CustomInput";

function App() {
  // Room state
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Editor state
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  
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

  // Join room handler
  const handleJoinRoom = (roomId, username) => {
    setRoomId(roomId);
    setUsername(username);
    setIsInRoom(true);
    
    // Join socket room
    socket.emit("join-room", { roomId, username });
    
    // Update URL without page reload
    window.history.pushState({}, "", `?room=${roomId}`);
  };

  // Leave room handler
  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomId, username });
    setIsInRoom(false);
    setRoomId(null);
    setUsername("");
    setUsers([]);
    setCode("");
    window.history.pushState({}, "", "/");
  };

  // Copy room link
  const copyRoomLink = () => {
    const url = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme change handler
  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    if (roomId) {
      socket.emit("theme-update", { roomId, theme: themeId });
    }
  };

  // Code change handler
  const emitCodeUpdate = useCallback(
    debounce((value) => {
      if (roomId) {
        socket.emit("code-update", { roomId, code: value });
      }
    }, 300),
    [roomId],
  );

  const handleCodeChange = (value) => {
    isTyping.current = true;
    setCode(value);
    emitCodeUpdate(value);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      isTyping.current = false;
    }, 500);
  };

  // Custom input change handler
  const handleCustomInputChange = (value) => {
    setCustomInput(value);
    if (roomId) {
      socket.emit("custom-input-update", { roomId, customInput: value });
    }
  };

  // Language change handler
  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    if (roomId) {
      socket.emit("language-update", { roomId, language: value });
    }
  };

  // Compile handler
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

    if (roomId) {
      socket.emit("compile-start", { 
        roomId,
        language: selectedLanguage.id,
        username,
        code: code.substring(0, 100) + "..."
      });
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SOCKET_URL}/api/judge/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language_id: selectedLanguage.id,
          source_code: code,
          stdin: customInput
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
        
        if (roomId) {
          socket.emit("compile-result", {
            roomId,
            success: true,
            data: result.data,
            username
          });
        }
      } else {
        setError(result.message || "Compilation failed");
        setStatus("Error");
        setStatusId(0);
        setExecutionTime("");
        setMemoryUsage(0);
        
        if (roomId) {
          socket.emit("compile-result", {
            roomId,
            success: false,
            message: result.message,
            username
          });
        }
      }
    } catch (error) {
      setError("Network error: " + error.message);
      setStatus("Error");
      setStatusId(0);
      setExecutionTime("");
      setMemoryUsage(0);
      
      if (roomId) {
        socket.emit("compile-result", {
          roomId,
          success: false,
          message: "Network error: " + error.message,
          username
        });
      }
    } finally {
      setIsCompiling(false);
    }
  };

  // Socket setup
  useEffect(() => {
    socket.connect();

    const handleRoomUsers = ({ users }) => {
      setUsers(users);
    };

    const handleLanguageUpdate = (data) => setSelectedLanguage(data.language);
    
    const handleCodeUpdate = (data) => {
      if (!isTyping.current) {
        setCode(data.code);
      }
    };
    
    const handleThemeUpdate = (data) => setSelectedTheme(data.theme);

    const handleCustomInputUpdate = (data) => {
      setCustomInput(data.customInput);
    };
    
    const handleCompileStart = (data) => {
      setIsCompiling(true);
      setOutput("");
      setError("");
      setCompileInfo("");
      setStatus(`${data.username} is running code...`);
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

    socket.on("room-users", handleRoomUsers);
    socket.on("code-update", handleCodeUpdate);
    socket.on("language-update", handleLanguageUpdate);
    socket.on("theme-update", handleThemeUpdate);
    socket.on("custom-input-update", handleCustomInputUpdate);
    socket.on("compile-start", handleCompileStart);
    socket.on("compile-result", handleCompileResult);

    // Check URL for room ID on load
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl) {
      setRoomId(roomFromUrl);
      // Show room entry with pre-filled room ID
    }

    return () => {
      socket.off("room-users", handleRoomUsers);
      socket.off("code-update", handleCodeUpdate);
      socket.off("language-update", handleLanguageUpdate);
      socket.off("theme-update", handleThemeUpdate);
      socket.off("custom-input-update", handleCustomInputUpdate);
      socket.off("compile-start", handleCompileStart);
      socket.off("compile-result", handleCompileResult);
      socket.disconnect();
    };
  }, []);

  // Show room entry if not in a room
  if (!isInRoom) {
    // Get room ID from URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const urlRoomId = urlParams.get('room') || '';
    return <RoomEntry onJoinRoom={handleJoinRoom} initialRoomId={urlRoomId} />;
  }

  // Main editor view
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CodersRoom
                </h1>
              </div>
              
              {/* Room Info */}
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <span className="text-xs text-gray-500">Room:</span>
                  <span className="text-sm font-mono font-medium text-gray-700">{roomId}</span>
                  <button
                    onClick={copyRoomLink}
                    className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy room link"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {/* Users List */}
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div className="flex -space-x-2">
                    {users.slice(0, 3).map((user, index) => (
                      <div
                        key={index}
                        className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-white flex items-center justify-center"
                        title={user.name}
                      >
                        <span className="text-white text-xs font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {users.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-medium">
                          +{users.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-3">
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
              <button
                onClick={handleLeaveRoom}
                className="ml-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Leave room"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

       {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Left Column - Editor and Input */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Code Editor */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 min-h-0">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Code Editor</span>
            </div>
            <div className="h-[calc(100%-40px)]">
              <CodeEditorWindow
                language={selectedLanguage.value}
                theme={selectedTheme}
                code={code}
                onChange={handleCodeChange}
              />
            </div>
          </div>
          
          {/* Custom Input */}
          <div className="flex-shrink-0">
            <CustomInput
              value={customInput}
              onChange={handleCustomInputChange}
              disabled={isCompiling}
              placeholder="Enter input for your program (stdin)..."
            />
          </div>
        </div>
        
        {/* Right Column - Output */}
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