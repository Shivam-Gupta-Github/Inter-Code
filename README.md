# Inter-Code

Inter-Code is a real-time code collaboration application designed for coding interviews and mock interview practice. Built using Node.js, React.js, and Socket.io, it allows users to create or join coding rooms and collaborate live using a synchronized code editor, making it an excellent tool for interview preparation.

## Features

- **Real-time Collaboration:** Users can work on the same code with synchronized updates, ideal for mock coding interviews.
- **Room Management:** Join an existing room using a Room ID or create a new one instantly.
- **Unique Room ID Generation:** Secure room access with unique IDs generated using UUID, suitable for one-on-one or group mock interviews.
- **User-Friendly Interface:** Simple UI for setting up mock interviews, sharing room IDs, and exiting the room.
- **Code Synchronization:** Keeps all participants on the same page during collaborative coding sessions.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express
- **Real-time Communication:** Socket.io
- **ID Generation:** UUID

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivam-Gupta-Github/Inter-Code.git
   cd inter-code

   ```
   
2. **Install dependencies:**
    
    For the server:
    
    ```bash
    bashCopy code
    cd server
    npm install
    
    ```
    
    For the client:
    
    ```bash
    bashCopy code
    cd ../client
    npm install
    
    ```
    
3. **Create Environment Files:**
    - Add a `.env` file inside the `server` directory for server configuration.
    - Add a `.env` file inside the `client` directory for client-specific variables.
4. **Run the application:**
    
    To start the server:
    
    ```bash
    bashCopy code
    cd server
    npm start
    
    ```
    
    To start the client:
    
    ```bash
    bashCopy code
    cd ../client
    npm start
    
    ```
    
5. **Access the application:**
    
    Open your browser and go to `http://localhost:3000`.
    

## Usage

1. Enter your username and Room ID on the landing page.
2. Click "Create Room" if you need a new Room ID.
3. Press "Join" to access the code editor.
4. Use the editor to practice coding with others in real-time.
5. Use the copy Room ID or leave room features as needed during sessions.

## Contributing

Contributions are welcome! Feel free to fork the repository, raise issues, or submit pull requests.
