export type Difficulty = 'Easy' | 'Medium' | 'Hard';

    export interface CandidateInfo {
    name: string | null;
    email: string | null;
    phone: string | null;
    }

    export interface Question {
    text: string;
    difficulty: Difficulty;
    answer: string;
    score?: number;
    justification?: string;
    }

    // State for the active interview session
    export interface InterviewState {
    candidateInfo: CandidateInfo;
    status: 'pending_resume' | 'missing_info' | 'in_progress' | 'completed';
    questions: Question[];
    currentQuestionIndex: number;
    finalScore: number;
    summary: string;
    messages: Message[];
    isTyping: boolean;
    currentTimerDuration: number | null;
    }

    export interface Candidate {
    id: string;
    candidateInfo: CandidateInfo;
    questions: Question[];
    messages: Message[];
    finalScore: number;
    summary: string;
    }

    export interface CandidatesState {
    candidates: any;
    list: Candidate[];
    }

    export interface Message {
        sender: 'ai' | 'user';
        text: string;
    }