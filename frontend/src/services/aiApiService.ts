import axios from 'axios';
import type { Difficulty } from '../types';
import type { Question } from '../types';


// Create an Axios instance configured to talk to our backend
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Define the function that calls our /generate-question endpoint
export const generateQuestion = async (
  difficulty: Difficulty,
  previousQuestions: string[]
): Promise<{ question: string }> => {
  const response = await apiClient.post('/generate-question', {
    difficulty,
    previousQuestions,
  });
  return response.data;
};

export const finalizeInterview = async (
  questions: Question[]
): Promise<{ finalScore: number; summary: string }> => {
  console.log('Sending questions to finalize:', questions); // Debug log
  const response = await apiClient.post('/finalize', { questions }); // Changed from transcript to questions
  return response.data;
};

export const evaluateAnswer = async (
  question: string,
  answer: string
): Promise<{ score: number }> => {
  const response = await apiClient.post('/evaluate-answer', { question, answer });
  return response.data;
};