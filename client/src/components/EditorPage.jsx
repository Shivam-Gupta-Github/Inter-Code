import { useState, useEffect, useRef } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../socket";
import toast from "react-hot-toast";
import {
  useLocation,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

function EditorPage() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const params = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit("join", {
        roomId: params.roomId,
        username: location.state?.username,
      });

      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        // This condition is only true for clients ALREADY in the room
        if (username !== location.state.username) {
          toast.success(`${username} joined the room`);

          // MOVED: Only existing clients should send the code to the new user.
          socketRef.current.emit("sync-code", {
            code: codeRef.current,
            socketId,
          });
        }
        setClients(clients);
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(params.roomId);
      toast.success(`Room Id has been copied to your clipboard`);
    } catch (e) {
      toast.error(`could not copy room id`);
      console.log(e);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <div className="main-wrapper">
      <div className="aside">
        <div className="aside-inner">
          <div className="logo">
            <img className="logo-image" src="/logo.png" alt="inter-code-logo" />
          </div>
          <h3>Connected</h3>
          <div className="clients-list">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copy-btn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leave-btn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editor-wrap">
        <Editor
          roomId={params.roomId}
          socketRef={socketRef}
          onCodeChange={(code) => (codeRef.current = code)}
        />
      </div>
    </div>
  );
}

export default EditorPage;
