# Inter-Code

Inter-Code is a real-time code collaboration platform designed for coding interviews and pair programming sessions. It features a secure room system with password protection, real-time code synchronization, and an integrated C++ code execution environment.

![Inter-Code Screenshot](https://github.com/user-attachments/assets/c095b262-08c3-4d5b-9596-0a60f0cd9f21)

## Features

- **Secure Room System:** Create or join rooms with password protection
- **Real-time Code Collaboration:** Synchronized code editor for all participants
- **C++ Code Execution:** Built-in code runner with input/output capabilities
- **User Management:** See connected users in real-time
- **Responsive Design:** Works seamlessly on various screen sizes
- **Code Reset:** Ability to reset code to initial state
- **Room Management:** Easy room creation, joining, and leaving functionality

## Tech Stack

### Frontend

- React.js
- Socket.IO Client
- CodeMirror 6
- React Router DOM
- React Hot Toast
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Socket.IO
- RESTful API Integration

## Quick Start Guide

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shivam-Gupta-Github/Inter-Code.git
   cd inter-code
   ```

2. **Set up the server**

   ```bash
   cd server
   npm install
   ```

3. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server**

   ```bash
   cd server
   npm start
   ```

   The server will start on port 5000

2. **Start the client**

   ```bash
   cd client
   npm run dev
   ```

   The client will start on port 5173

3. **Access the application**
   - Open your browser and visit: http://localhost:5173
   - For production build, use `npm run build`

## Usage Guide

1. **Create a Room**

   - Click Create Room, enter a Room ID, Passkey, and Username.

2. **Join a Room**

   - Click Join Room, enter details, and join securely.

3. **Code Together**

   - Type in the editor — all changes sync live.
   - Run C++ code and view output instantly.
   - Copy Room ID to share and use Leave to exit.

## Contributing

We welcome contributions to Inter-Code! Here's how you can help:

### Setting up for Development

1. Fork the repository
2. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test your changes thoroughly
5. Push to your fork and submit a pull request

### Tips

- Follow existing code style.
- Use meaningful names and concise comments.
- Test responsiveness and real-time sync.

### Bug Reports

If you find a bug, please create an issue with:

- Describe the bug and steps to reproduce.
- Include expected vs actual behavior.
- Attach screenshots if possible.

## Contact

Shivam Gupta - [LinkedIn](https://www.linkedin.com/in/cse-shivam-gupta/)

Project Link: [https://github.com/Shivam-Gupta-Github/Inter-Code](https://github.com/Shivam-Gupta-Github/Inter-Code)
