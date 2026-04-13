import CodeEditorWindow from "./components/CodeEditorWindow";
import LanguagesDropDown from "./components/LanguageDropDown";
import ThemeDropDown from "./components/ThemeDropDown";
import { useState, useEffect } from "react";
import { languageOptions } from "./constants/languageOptions";
import { socket } from "./lib/socket";
import { useCallback, useRef } from "react";
import { debounce } from "lodash";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [code, setCode] = useState("");
  
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

  useEffect(() => {
    socket.connect();

    const handleLanguageUpdate = (data) => setSelectedLanguage(data.language);
    const handleCodeUpdate = (data) => {
      if (!isTyping.current) {   // only apply remote update if YOU are not typing
        setCode(data.code);
      }
    };
    const handleThemeUpdate = (data) => setSelectedTheme(data.theme);

    socket.on("code-update", handleCodeUpdate);
    socket.on("language-update", handleLanguageUpdate);
    socket.on("theme-update", handleThemeUpdate);

    return () => {
      socket.off("code-update", handleCodeUpdate);
      socket.off("language-update", handleLanguageUpdate);
      socket.off("theme-update", handleThemeUpdate);
      socket.disconnect();
    };
  }, []);
  


  return (
    <div>
      <nav className="flex items-center gap-4 p-4">
        <LanguagesDropDown
          onSelectChange={handleLanguageChange}
          selectedLanguage={selectedLanguage}
        />
        <ThemeDropDown
          handleThemeChange={handleThemeChange}
          theme={selectedTheme}
        />
      </nav>
      <CodeEditorWindow
        language={selectedLanguage.value}
        theme={selectedTheme}
        code={code}
        onChange={handleCodeChange}
      />
    </div>
  );
}

export default App;
