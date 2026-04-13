import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        // Only key on language — remounting on theme change is unnecessary
        // and causes an annoying flicker. The Editor handles theme reactively.
        key={language}
        height="85vh"
        width="80%"
        language={language || "javascript"}
        value={code}
        theme={theme}
        defaultValue="// some comment"
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditorWindow;