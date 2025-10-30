import { useEffect, useRef, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState, Annotation } from "@codemirror/state";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import "./CodeEditor.css";
import { RotateCcw } from "lucide-react";

const PISTON_API = "https://emkc.org/api/v2/piston";

const remoteChange = Annotation.define();

function Editor({ roomId, socketRef, codeRef }) {
  const editorRef = useRef(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const state = EditorState.create({
      doc: "",
      extensions: [
        cpp(),
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
            codeRef.current = update.state.doc.toString();
            socketRef.current.emit("code-change", {
              roomId,
              changes,
              code: codeRef.current,
            });
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

    // Request initial code from server when joining
    socketRef.current.emit("request-code", { roomId });

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
      codeRef.current = editorRef.current.state.doc.toString();
    };

    socketRef.current.on("code-update", handler);
    return () => {
      if (socketRef.current) {
        socketRef.current.off("code-update", handler);
      }
    };
  }, [socketRef.current]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    const code = codeRef.current;
    try {
      const response = await fetch(`${PISTON_API}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "c++",
          version: "10.2.0",
          files: [
            {
              name: "main.cpp",
              content: code,
            },
          ],
          stdin: input,
        }),
      });

      const data = await response.json();

      if (data.run) {
        const output = data.run.output || "";
        const stderr = data.run.stderr || "";
        const combinedOutput = stderr ? `${output}\n${stderr}` : output;
        setOutput(combinedOutput || "No output");
      } else {
        setOutput("Error: Unable to execute code");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-editor-container">
      <div className="editor-section">
        <div className="editor-header">
          <span className="editor-title">C++ Editor</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="p-2 rounded-lg text-white transition-colors hover:bg-white/10 cursor-pointer"
              onClick={() => socketRef.current.emit("reset-code", { roomId })}
            >
              <RotateCcw size={20} />
            </button>
            <button
              className="run-button"
              onClick={runCode}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        <div className="editor-content">
          <div
            ref={editorRef}
            style={{
              height: "100%",
              width: "100%",
              fontSize: "18px",
              fontFamily: "monospace",
            }}
          />
        </div>
      </div>

      <div className="io-section">
        <div className="input-panel">
          <div className="panel-header">Input</div>
          <textarea
            className="input-textarea"
            placeholder="Enter input here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="output-panel">
          <div className="panel-header">Output</div>
          <pre className="output-pre">
            {output || "Output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Editor;
