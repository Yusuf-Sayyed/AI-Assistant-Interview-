import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { generateQuestion, finalizeInterview, evaluateAnswer } from '../services/aiApiService';
import { addCandidate } from './candidatesSlice';
import type { RootState } from '../app/store';
import type { InterviewState, CandidateInfo, Message, Question, Difficulty, Candidate } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: InterviewState = {
  candidateInfo: { name: null, email: null, phone: null },
  status: 'pending_resume',
  questions: [],
  currentQuestionIndex: 0,
  finalScore: 0,
  summary: '',
  messages: [],
  isTyping: false,
  currentTimerDuration: null,
};

export const triggerFinalizeInterview = createAsyncThunk(
  'interview/finalize',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { questions, candidateInfo, messages } = state.interview;

    try {
      const result = await finalizeInterview(questions);
      const candidate: Candidate = {
        id: uuidv4(),
        candidateInfo,
        questions,
        messages,
        finalScore: result.finalScore,
        summary: result.summary
      };

      dispatch(addCandidate(candidate));
      return result;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchNextQuestion = createAsyncThunk(
  'interview/fetchNextQuestion',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { currentQuestionIndex, questions } = state.interview;

    let difficulty: Difficulty = 'Easy';
    if (currentQuestionIndex >= 2 && currentQuestionIndex < 4) difficulty = 'Medium';
    else if (currentQuestionIndex >= 4) difficulty = 'Hard';

    const previousQuestions = questions.map(q => q.text);
    const response = await generateQuestion(difficulty, previousQuestions);
    const newQuestion: Question = { text: response.question, difficulty, answer: '' };
    dispatch(addQuestion(newQuestion));
    return { sender: 'ai', text: response.question } as Message;
  }
);

export const submitAndEvaluateAnswer = createAsyncThunk(
  'interview/submitAndEvaluateAnswer',
  async (answer: string, { dispatch, getState }) => {
    dispatch(saveAnswer(answer));

    const state = getState() as RootState;
    const questionIndex = state.interview.questions.length - 1;
    const currentQuestion = state.interview.questions[questionIndex];

    if (currentQuestion) {
      const { score } = await evaluateAnswer(currentQuestion.text, answer);
      dispatch(saveScore({ questionIndex, score }));
    }

    const newState = getState() as RootState;
    if (newState.interview.questions.length >= 6) {
      dispatch(triggerFinalizeInterview());
    } else {
      dispatch(fetchNextQuestion());
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCandidateInfo: (state, action: PayloadAction<Partial<CandidateInfo>>) => {
      state.candidateInfo = { ...state.candidateInfo, ...action.payload };
      const { name, email, phone } = state.candidateInfo;
      state.status = (name && email && phone) ? 'in_progress' : 'missing_info';
    },
    updateCandidateInfo: (state, action: PayloadAction<Partial<CandidateInfo>>) => {
      state.candidateInfo = { ...state.candidateInfo, ...action.payload };
      const { name, email, phone } = state.candidateInfo;
      if (name && email && phone) {
        state.status = 'in_progress';
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (!state.messages) {
        state.messages = [];
      }
      state.messages.push(action.payload);
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
      state.currentQuestionIndex++;
      switch (action.payload.difficulty) {
        case 'Easy':
          state.currentTimerDuration = 20;
          break;
        case 'Medium':
          state.currentTimerDuration = 60;
          break;
        case 'Hard':
          state.currentTimerDuration = 120;
          break;
      }
    },
    saveAnswer: (state, action: PayloadAction<string>) => {
      const currentQuestion = state.questions[state.questions.length - 1];
      if (currentQuestion) {
        currentQuestion.answer = action.payload;
      }
    },
    saveScore: (state, action: PayloadAction<{ questionIndex: number; score: number }>) => {
      const { questionIndex, score } = action.payload;
      if (state.questions[questionIndex]) {
        state.questions[questionIndex].score = score;
      }
    },
    resetInterview: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNextQuestion.pending, (state) => {
        state.isTyping = true;
        state.currentTimerDuration = null;
      })
      .addCase(fetchNextQuestion.fulfilled, (state, action) => {
        state.isTyping = false;
        state.messages.push(action.payload);
      })
      .addCase(fetchNextQuestion.rejected, (state) => {
        state.isTyping = false;
        state.messages.push({ sender: 'ai', text: 'Sorry, an error occurred.' });
      })
      .addCase(triggerFinalizeInterview.pending, (state) => {
        state.isTyping = true;
        state.currentTimerDuration = null;
      })
      .addCase(triggerFinalizeInterview.fulfilled, (state, action) => {
        state.isTyping = false;
        state.finalScore = action.payload.finalScore;
        state.summary = action.payload.summary;
        state.status = 'completed';
        state.currentTimerDuration = null;
        state.messages.push({
          sender: 'ai',
          text: `Interview complete! Final Score: ${action.payload.finalScore}/100. Summary: ${action.payload.summary}`
        });
      })
      .addCase(triggerFinalizeInterview.rejected, (state) => {
        state.isTyping = false;
        state.messages.push({ sender: 'ai', text: 'Sorry, an error occurred while finalizing your results.' });
      });
  },
});

export const {
  setCandidateInfo,
  updateCandidateInfo,
  addMessage,
  addQuestion,
  saveAnswer,
  saveScore,
  resetInterview
} = interviewSlice.actions;

export default interviewSlice.reducer;
