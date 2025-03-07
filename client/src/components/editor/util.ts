import * as monaco from 'monaco-editor';
import { LANG_EXTENSION, LANG_ID } from './constants';

export const registerLanguage = () => {
  monaco.languages.register({
    id: LANG_ID,
    aliases: [LANG_ID],
    extensions: [LANG_EXTENSION],
  });
};

export const createModel = (filePath: string): monaco.editor.ITextModel =>
  monaco.editor.createModel('', LANG_ID, monaco.Uri.parse(filePath));
