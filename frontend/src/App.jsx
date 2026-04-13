import CodeEditorWindow from "./components/CodeEditorWindow";
import LanguagesDropDown from "./components/LanguageDropDown";
import ThemeDropDown from "./components/ThemeDropDown";
import { useState, useEffect } from "react";
import { languageOptions } from "./constants/languageOptions";
import { socket } from "./lib/socket";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [code, setCode] = useState("");

  // Normalize: accept the theme string directly (not a synthetic event)
  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    socket.emit("theme-update", { theme: themeId });
  };

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("code-update", { code: value });
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    socket.emit("language-update", { language: value });
  };

  useEffect(() => {
    socket.connect();

    const handleLanguageUpdate = (data) => setSelectedLanguage(data.language);
    const handleCodeUpdate     = (data) => setCode(data.code);
    const handleThemeUpdate    = (data) => setSelectedTheme(data.theme);

    socket.on("code-update",     handleCodeUpdate);
    socket.on("language-update", handleLanguageUpdate);
    socket.on("theme-update",    handleThemeUpdate);

    return () => {
      socket.off("code-update",     handleCodeUpdate);
      socket.off("language-update", handleLanguageUpdate);
      socket.off("theme-update",    handleThemeUpdate);
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