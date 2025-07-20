#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Install dependencies if node_modules directory doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the server in the background
echo "Starting the server..."
node server.js &
SERVER_PID=$!

# Wait for the server to start
sleep 2

# Open the multiplayer.html file in the default browser
echo "Opening multiplayer.html in your browser..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open multiplayer.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open multiplayer.html
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start multiplayer.html
else
    echo "Could not open the browser automatically. Please open multiplayer.html manually."
fi

# Wait for user to press Ctrl+C
echo "Server is running. Press Ctrl+C to stop."
trap "kill $SERVER_PID; echo 'Server stopped.'; exit 0" INT
wait $SERVER_PID