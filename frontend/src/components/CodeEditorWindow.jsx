import Editor from "@monaco-editor/react";
import { getStarterCode } from "../constants/starterCode";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  return (
    <div className="w-full h-full">
      <Editor
        key={language}
        height="100%"
        width="100%"
        language={language || "javascript"}
        value={code}
        theme={theme}
        defaultValue={getStarterCode(language)}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Consolas', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;