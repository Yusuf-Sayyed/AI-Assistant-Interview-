# AI-Powered Interview Assistant

An intelligent interview system that conducts and evaluates technical interviews for full-stack developers, powered by OpenRouter's DeepSeek AI.

## Features

- 🤖 AI-driven interview process
- 📝 Resume parsing (PDF/DOCX)
- ⏱️ Timed technical questions
- 📊 Real-time evaluation
- 💾 Local progress persistence
- 📋 Interviewer dashboard

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key ([Get it here](https://openrouter.ai/))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Yusuf-Sayyed/AI-Assistant-Interview-.git
cd swipe-assignment
```

2. Install all dependencies from root:
```bash
npm install
```

3. Create `.env` file in the api directory:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Note: Make sure to use the "DeepSeek: R1 0528" model from OpenRouter (free tier)

## Running the Application

Start both servers with a single command from root:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3001

## Project Structure

```
├── api/                  # Express + TypeScript API
│   ├── index.ts         # Server entry point
│   └── .env             # Environment variables
├── frontend/            # React + TypeScript frontend
│   ├── src/
│   │   ├── app/        # Redux store setup
│   │   ├── components/ # Reusable components
│   │   ├── features/   # Redux slices
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilities
│   │   ├── pages/      # Main page components
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript definitions
│   └── package.json
└── package.json         # Root package.json for workspaces
```

## Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Ant Design component library
- Vite for build tooling

### API
- Node.js with Express
- TypeScript
- OpenRouter AI integration

## Environment Variables

API `.env` configuration:
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
- Progress is automatically saved locally using Redux persist
- Supports resume parsing and info extraction
- Real-time progress tracking with visual indicators
