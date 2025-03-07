import { useState } from 'react';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import { connectToLs } from '../ls-client/ws-client';
import { LANG_ID, MONACO_OPTIONS } from './constants';
import { createModel, registerLanguage } from './util';

type EditorProps = { title: string; fileUri: string };

export function Editor({ title, fileUri }: EditorProps) {
  const [editor, setEditor] = useState(null);
  const editorDidMount: EditorDidMount = (editor) => {
    setEditor(editor);
    registerLanguage();
    editor.setModel(createModel(fileUri));
    connectToLs();
    editor.focus();

    editor.addAction({
      id: 'custom-action-hello',
      label: 'Say Hello',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: (editor) => {
        alert('Hello from Monaco Editor! 🚀');
      },
    });
  };

  return (
    <div>
      <div>
        <h3>{title}</h3>
      </div>
      <div>
        <MonacoEditor
          width="100%"
          height="40vh"
          language={LANG_ID}
          theme="vs-dark"
          options={MONACO_OPTIONS}
          editorDidMount={editorDidMount}
        />
      </div>
    </div>
  );
}
