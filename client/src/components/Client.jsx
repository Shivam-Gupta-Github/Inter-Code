import Avatar from "react-avatar";

function Client({ username }) {
  return (
    <div className="client">
      <Avatar name={username} size={75} round="10px" />
      <span className="username">{username}</span>
    </div>
  );
}

export default Client;
