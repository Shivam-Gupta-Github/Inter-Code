import React, { useEffect, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState, Annotation } from "@codemirror/state";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

const remoteChange = Annotation.define();

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
          if (
            update.docChanged &&
            !update.transactions.some((tr) => tr.annotation(remoteChange))
          ) {
            const changes = [];
            update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
              changes.push({
                from: fromA,
                to: toA,
                insert: inserted.toString(),
              });
            });
            onCodeChange(update.state.doc.toString());
            socketRef.current.emit("code-change", { roomId, changes });
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

    // The handler now receives a payload that can have EITHER 'changes' OR 'code'
    const handler = (payload) => {
      if (!editorRef.current) return;

      // Check if the payload contains delta changes for typing
      if (payload.changes) {
        editorRef.current.dispatch({
          changes: payload.changes,
          annotations: remoteChange.of(true),
        });
      }
      // Check if the payload contains the full code for initial sync
      else if (payload.code != null) {
        // Use != null to handle empty string case
        const currentCode = editorRef.current.state.doc.toString();
        if (currentCode !== payload.code) {
          editorRef.current.dispatch({
            changes: { from: 0, to: currentCode.length, insert: payload.code },
            annotations: remoteChange.of(true),
          });
        }
      }
    };

    socketRef.current.on("code-change", handler);
    return () => {
      if (socketRef.current) {
        socketRef.current.off("code-change", handler);
      }
    };
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
