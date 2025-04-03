#!/bin/bash

# Start MongoDB (if not running)
if ! docker ps | grep -q mongodb; then
    echo "Starting MongoDB..."
    docker run --name mongodb -p 27017:27017 -d mongo
fi

# Start backend server
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to handle shutdown
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    docker stop mongodb
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
done 