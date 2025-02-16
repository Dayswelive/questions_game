🎮 Questions Game
A **real-time multiplayer quiz game** built using **Node.js, WebSockets, and REST APIs**. This project handles **user authentication**, **game sessions**, and **real-time interactions** with **Socket.io**.

🚀 Features
✅ Real-time multiplayer quiz functionality
✅ WebSocket integration for live game sessions
✅ REST API for game management
✅ Authentication using JWT
✅ MongoDB for data storage

📌 Table of Contents

- 🛠️ Setup Instructions
- 🔑 Authentication
- 📡 WebSocket Setup
- 📂 Folder Structure
- 📽️ Demo & Walkthrough
- 🛠️ Tech Stack
- ❓ Need Help?
  🛠️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Dayswelive/questions_game.git
cd questions_game
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root and add the required configurations:

````env
MONGO_URI=mongodb://localhost:27017/questions_game

### 4️⃣ Start the Application
#### Development Mode
```bash
npm run start:dev
````

#### Production Mode

```bash
npm run start:prod
```

🔑 Authentication

### **Register a User**

```http
POST /auth/register
```

**Request Body:**

```json
{
  "username": "xyz",
  "password": "123456"
}
```

### **Login**

```http
POST /auth/login
```

**Response:**

```json
{
  "username": "xyz",
  "password": "123456"
}
```

📡 WebSocket Setup
Connect to the WebSocket server at:

```ws
ws://localhost:3000
```

### **Events**

Please Check game.service.ts and game-gateway.ts file for every event on socket file.
📂 Folder Structure

```
📦 questions_game
 ┣ 📂 src
 ┃ ┣ 📂 User  # User module
 ┃ ┣ 📂 Questions       # Questions Modules
 ┃ ┣ 📂 game       # Game module.
 ┃ ┗ app.module.ts       # Main Entry Point
 ┣ 📜 .env.example   # Environment Variables Example
 ┣ 📜 README.md      # Project Documentation
 ┣ 📜 package.json   # Node.js Dependencies
 ┣ 📜 .gitignore     # Ignored Files
 ┗ 📜 tsconfig.json  # TypeScript Configurations
```

📽️ Demo & Walkthrough
🎥 **Loom Recording:** [Google Drive Link](https://drive.google.com/file/d/1NJazEo7iCGg0GlC9ICVUEMBo4vwAwr_N/view)
🛠️ Tech Stack
🔹 Nest.js
🔹 WebSockets (Socket.io)
🔹 MongoDB
🔹 JWT Authentication
❓ Need Help?
If you face any issues, feel free to reach out. 🚀
✨ +91 9548278022 - Suryansh Dev ✨
