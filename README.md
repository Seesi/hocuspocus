
# Yjs + Hocuspocus Real-Time Collaborative Task Manager Demo

This demo showcases a collaborative task manager console application built with **Yjs** for real-time document synchronization and **Hocuspocus** for WebSocket-based server-client communication. It allows multiple clients to interact with a shared task list, with updates reflected across all clients in real time.

## Demo Overview

- **Collaborative Task Management**: Multiple clients can add tasks to the same task list. When one client adds a task, it automatically updates for all other clients.
- **Real-Time Syncing**: The demo uses Yjs for syncing data in real time between clients via a WebSocket server powered by Hocuspocus.
- **Offline-First Support**: Clients can work offline and their changes will be synchronized once they reconnect to the server.

## Project Structure

```
/
├── server/                # WebSocket server for managing document sync
│   └── server.mjs         # Hocuspocus WebSocket server implementation
|   └── package.json       # server app dependencies and configuration
├── client/                # Client-side application to interact with tasks
│   └── app.mjs            # Main client app interacting with task list
|   └── package.json       # client app dependencies and configuration
├── README.md              # Project documentation
```

### Key Components:
- **server/**: Contains the Hocuspocus WebSocket server that handles document synchronization.
- **client/**: Contains the client app that communicates with the server and allows users to add and view tasks.

## Demo Instructions

### 1. Clone the Repo

First, clone the demo repository to your local machine:

```bash
git clone https://github.com/seesi/hocuspocus .git
cd demo-repo
```

### 2. Install Dependencies

Before running the server or client, install the necessary dependencies in both the `server/` and `client/` directories.

#### Install server dependencies:

```bash
cd server
npm install
```

#### Install client dependencies:

```bash
cd ../client
npm install
```

### 3. Start the Server

Start the WebSocket server by running the following command from the `server/` directory:

```bash
cd server
node server.mjs
```

The server will be listening on `ws://localhost:1234`, ready to handle client connections.

### 4. Start the Client

In another terminal window, run the client application from the `client/` directory:

```bash
cd client
node app.mjs
```

### 5. Adding Tasks

Once the client is running, you can add tasks to the shared list by typing them into the terminal. Any task you add will automatically sync with other connected clients in real time.

To exit the app, type `exit`.

### 6. Running Multiple Clients

You can run multiple client instances by opening additional terminal windows and repeating step 4. All connected clients will see task updates in real time.

## Features

- **Real-Time Collaboration**: Tasks are synchronized across all clients instantly.
- **Offline-First**: Clients can add tasks even when disconnected from the server. Changes will sync once the server is online.
- **Retry Mechanism**: The client will automatically attempt to reconnect to the server if the connection is lost.
- **Task List Management**: Tasks can be added to the list, which is automatically updated for all connected clients.

## Troubleshooting

- **Server not starting**: Ensure that no other processes are using port 1234. You can change the port in `server.mjs` if necessary.
- **Connection issues**: Verify that the server is running and that WebSocket connections are allowed. Check for firewall issues that might block the connection.
- **Retries**: If you notice delays in retries or connection attempts, adjust the retry configuration in the `HocuspocusProvider` settings in the `client/app.mjs` file.

## Development

### Running the Demo in Development Mode

To automatically rebuild and restart the server or client on changes, you can use **`nodemon`**:

1. Install `nodemon` globally:

```bash
npm install -g nodemon
```

2. Run the server or client with `nodemon` for auto-reloading:

```bash
# For server:
nodemon server/server.mjs

# For client:
nodemon client/app.mjs
```

### Customizing the Demo

- **Server**: Modify `server.mjs` to adjust WebSocket configurations or add additional features like access control.
- **Client**: Modify `app.mjs` to add more complex task management functionality, validations, or UI integrations.

