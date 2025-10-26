var BASE_URL = "http://localhost:5000/api/rooms";
if (import.meta.env.VITE_BACKEND_URL) {
  BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/rooms";
}

export const createRoom = async (roomId, passkey) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, passkey }),
  });
  return res.json();
};

export const verifyRoom = async (roomId, passkey) => {
  const res = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, passkey }),
  });
  return res.json();
};
