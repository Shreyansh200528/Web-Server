# Node.js Static File Server with Logging and Graceful Shutdown

This server made in Node.js handles lightweight HTTP and serving static files. It delivers requested files from a directory named 'www' and displays custom error pages for statuses 403 and 404 from the error directory. Requests are all logged by the server and it executes a graceful exit when shutting down on a termination signal.

## Features

- 📦 - Files are automatically sent from the `www/` folder
- ⚠️ Custom error pages:
    -403 Forbidden
    -404 Not Found
- 🕒 All requests to the server log timestamps, types of method used, IP addresses connected, the pathname asked for
- 🛑  If you send `SIGINT` or `SIGTERM`, the program will finish all its functions and shut down.
- 🔒 It disconnects from servers you are still using, before finishing the shutdown.

## 🛠️ Setup

### 1. Requirements

- [Node.js](https://nodejs.org/) (version 12+ recommended)

### 2. Installation

Clone the repository or copy the files.


  ## Startup
  Running the Server-
  node main.js <port you want to use>
  (node main.js 8080)
  
  http://localhost:8080/index.html

  ## Closning
  Stopping the Server-
  Press Ctrl + C to stop the server.
    -Log the shutdown signal.
    -Stop accepting new connections.
    -Close all open client socket.


  ## Log
  Example logs look like -
[INFO] Thu May 29 2025 22:29:26 GMT+0530 (India Standard Time) - Server started. Listening on port 8080
[INFO] Thu May 29 2025 22:30:06 GMT+0530 (India Standard Time) - Accepted connection from 127.0.0.1:61127
[INFO] Thu May 29 2025 22:30:08 GMT+0530 (India Standard Time) - 127.0.0.1:61130 - "GET /index.html HTTP/1.1" - 200 OK
[INFO] Thu May 29 2025 22:30:09 GMT+0530 (India Standard Time) - 127.0.0.1:61131 - "GET /style.css HTTP/1.1" - 200 OK
[INFO] Thu May 29 2025 22:30:09 GMT+0530 (India Standard Time) - Accepted connection from 127.0.0.1:61132
[INFO] Thu May 29 2025 22:30:09 GMT+0530 (India Standard Time) - 127.0.0.1:61132 - "GET /script.js HTTP/1.1" - 200 OK
[INFO] Thu May 29 2025 22:30:09 GMT+0530 (India Standard Time) - Accepted connection from 127.0.0.1:61133
[INFO] Thu May 29 2025 22:30:10 GMT+0530 (India Standard Time) - Accepted connection from 127.0.0.1:61134
[INFO] Thu May 29 2025 22:30:10 GMT+0530 (India Standard Time) - 127.0.0.1:61133 - "GET /image.png HTTP/1.1" - 200 OK
[INFO] Thu May 29 2025 22:30:17 GMT+0530 (India Standard Time) - Accepted connection from 127.0.0.1:61135
[ERROR] Thu May 29 2025 22:30:17 GMT+0530 (India Standard Time) - 127.0.0.1:61134 - "GET /inde.html HTTP/1.1" - 404 Not Found
[INFO] Thu May 29 2025 22:30:23 GMT+0530 (India Standard Time) - Shutdown signal received.
[ERROR] Thu May 29 2025 22:30:28 GMT+0530 (India Standard Time) - Force exiting after timeout.
  
