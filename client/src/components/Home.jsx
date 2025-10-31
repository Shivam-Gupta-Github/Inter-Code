import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createRoom, verifyRoom } from "../api/roomService";

function Home() {
  const [isJoin, setIsJoin] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [passkey, setPasskey] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!roomId || !username || !passkey) {
      toast.error("Room ID, Username, and Passkey are required.");
      return;
    }
    try {
      const res = await verifyRoom(roomId, passkey);
      if (res.message === "Access granted.") {
        toast.success("Access granted!");
        navigate(`/editor/${roomId}`, { state: { username } });
      } else {
        toast.error(res.message || "Invalid Room ID or Passkey.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error verifying room.");
    }
  };

  const handleCreateRoom = async () => {
    if (!roomId || !username || !passkey) {
      toast.error("Room ID, Username, and Passkey are required.");
      return;
    }
    try {
      const res = await createRoom(roomId, passkey);
      if (res.message === "Room created successfully!") {
        toast.success("Room created successfully!");
        navigate(`/editor/${roomId}`, { state: { username } });
      } else {
        toast.error(res.message || "Failed to create room.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while creating room.");
    }
  };

  const handleSubmit = () => {
    isJoin ? handleJoinRoom() : handleCreateRoom();
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") handleSubmit();
  };

  return (
    <div className="homepage-wrapper">
      <div className="form-wrapper">
        <img className="homepage-logo" src="/logo.png" alt="homepage-logo" />

        <h4 className="main-label">
          {isJoin ? "Join a Room" : "Create a Room"}
        </h4>

        <div className="input-wrapper">
          <input
            type="text"
            className="input-box"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="password"
            className="input-box"
            placeholder="PASSKEY"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="input-box"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />

          <button className="btn join-btn" onClick={handleSubmit}>
            {isJoin ? "Join Room" : "Create Room"}
          </button>

          <h4 className="toggle-link">
            {isJoin ? (
              <>
                Don't have a room?{" "}
                <span
                  className="link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsJoin(false);
                    setRoomId("");
                    setPasskey("");
                    setUsername("");
                  }}
                >
                  Create Room
                </span>
              </>
            ) : (
              <>
                Already have a room?{" "}
                <span
                  className="link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsJoin(true);
                    setRoomId("");
                    setPasskey("");
                    setUsername("");
                  }}
                >
                  Join Room
                </span>
              </>
            )}
          </h4>
        </div>
      </div>

      <footer>
        <h4>
          Built by{" "}
          <a
            className="linkedin"
            href="https://www.linkedin.com/in/cse-shivam-gupta/"
          >
            Shivam Gupta
          </a>
        </h4>
      </footer>
    </div>
  );
}

export default Home;
