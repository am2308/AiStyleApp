#!/bin/bash

# StyleAI Local Development Script
set -e

echo "🚀 Starting StyleAI Local Development Environment..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file for local development..."
    cp .env.serverless.example .env
    
    # Set local development defaults
    sed -i 's/API_DOMAIN_NAME=.*/API_DOMAIN_NAME=localhost/' .env
    sed -i 's/FRONTEND_URL=.*/FRONTEND_URL=http:\/\/localhost:5173/' .env
    
    echo "⚠️  Please edit .env file with your API keys"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend in serverless offline mode
echo "🔧 Starting backend (Serverless Offline)..."
npx serverless offline --stage dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "🎨 Starting frontend (Vite)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Development Environment Started!"
echo ""
echo "📊 Services:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo "   API:      http://localhost:3000/api"
echo ""
echo "🛑 To stop: Ctrl+C"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
