# AI-Powered Interview Assistant

An intelligent interview system that conducts and evaluates technical interviews for full-stack developers, powered by OpenRouter's DeepSeek AI.

## Features

- AI-driven interview process
- Resume parsing (PDF/DOCX)
- Timed technical questions
- Real-time evaluation
- Local progress persistence
- Interviewer dashboard

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key ([Get it here](https://openrouter.ai/))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swipe-assignment
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create `.env` file in the backend directory:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Note: Make sure to use the "DeepSeek: R1 0528" model from OpenRouter (free tier)

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```
The server will run on http://localhost:3001

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The application will be available at http://localhost:5173

## Project Structure

```
├── backend/                # Express + TypeScript backend
│   ├── index.ts           # Server entry point
│   └── .env              # Environment variables
└── frontend/             # React + TypeScript frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── features/     # Redux slices
    │   ├── pages/        # Main page components
    │   ├── services/     # API services
    │   └── types/        # TypeScript definitions
    └── package.json
```

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Redux Toolkit
  - Ant Design
  - Vite

- Backend:
  - Node.js
  - Express
  - TypeScript
  - OpenRouter AI

## Environment Variables

Backend `.env` configuration:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Interview Process

1. Upload resume or fill in details
2. Answer 6 technical questions:
   - 2 Easy (20s each)
   - 2 Medium (60s each)
   - 2 Hard (120s each)
3. Receive AI evaluation and feedback

## Development Notes

- Uses OpenRouter's DeepSeek model for AI interactions
- Questions are dynamically generated based on difficulty
- Answers are evaluated in real-time
- Progress is automatically saved locally#