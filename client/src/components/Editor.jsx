import React, { useEffect, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

function Editor({ roomId, socketRef, onCodeChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const state = EditorState.create({
      doc: "",
      extensions: [
        javascript(),
        dracula,
        closeBrackets(),
        history(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const code = update.state.doc.toString();
            onCodeChange(code);
            socketRef.current.emit("code-change", { roomId, code });
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    editorRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    const handler = ({ code }) => {
      const currentCode = editorRef.current.state.doc.toString();
      if (currentCode !== code) {
        editorRef.current.dispatch({
          changes: { from: 0, to: currentCode.length, insert: code },
        });
      }
    };

    socketRef.current.on("code-change", handler);
    return () => socketRef.current.off("code-change", handler);
  }, [socketRef.current]);

  return (
    <div
      ref={editorRef}
      style={{
        height: "100%",
        width: "100%",
        fontSize: "18px",
        fontFamily: "monospace",
      }}
    />
  );
}

export default Editor;
