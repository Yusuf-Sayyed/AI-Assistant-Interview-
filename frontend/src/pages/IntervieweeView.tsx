import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import ResumeUploader from '../components/ResumeUploader';
import InfoCollector from '../components/InfoCollector';
import ChatWindow from '../components/ChatWindow';
import { addMessage } from '../features/interviewSlice';
import type { RootState, AppDispatch } from '../app/store';

const IntervieweeView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { status, messages, candidateInfo, finalScore, summary } = useSelector(
    (state: RootState) => state.interview
  );

  useEffect(() => {
    // This effect should run when status changes to 'in_progress'
    if (status === 'in_progress' && messages.length === 0) {
      dispatch(
        addMessage({
          sender: 'ai',
          text: `Hello ${candidateInfo.name}! Welcome. This interview will consist of 6 questions: 2 easy, 2 medium, and 2 hard. Each question is timed. Please answer to the best of your ability. Are you ready to begin?`,
        })
      );
    }
  }, [status, messages.length, candidateInfo.name, dispatch]);

  const renderContent = () => {
    switch (status) {
      case 'completed':
        return (
          <div>
            <h2>Interview Completed!</h2>
            <h3>Final Score: {finalScore}%</h3>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <h4>Summary:</h4>
              {summary}
            </div>
          </div>
        );
      case 'pending_resume':
        return <ResumeUploader />; // Simplified for clarity
      case 'missing_info':
        return <InfoCollector />; // Simplified for clarity
      case 'in_progress':
        // It gets stuck here if messages.length stays 0
        if (messages.length === 0) {
          return (
            <Spin tip="Preparing your interview..." size="large">
              <div style={{ padding: '50px' }} />
            </Spin>
          );
        }
        return <ChatWindow />;
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default IntervieweeView;