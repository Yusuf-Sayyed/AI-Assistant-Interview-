import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button, Form, Space, Progress } from 'antd';
import MessageComponent from './Message';
import Timer from './Timer';
import { useTimer } from '../hooks/useTimer';
import { addMessage, submitAndEvaluateAnswer } from '../features/interviewSlice';
import type { RootState, AppDispatch } from '../app/store';

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isTyping, currentTimerDuration, status, currentQuestionIndex } = useSelector(
    (state: RootState) => state.interview
  );
  const [form] = Form.useForm();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (!isTyping) {
      isSubmitting.current = false;
    }
  }, [isTyping]);

  const handleTimeout = useCallback(() => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    const answer = form.getFieldValue('input') || '';
    dispatch(addMessage({ sender: 'user', text: answer || '(No answer submitted)' }));

    dispatch(submitAndEvaluateAnswer(answer));

    form.resetFields();
  }, [dispatch, form]);

  const { timeLeft } = useTimer(currentTimerDuration || 0, handleTimeout);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onFinish = (values: { input: string }) => {
    if (isSubmitting.current) return;
    const answer = values.input;
    if (!answer?.trim()) {
        return;
    }
    isSubmitting.current = true;

    dispatch(addMessage({ sender: 'user', text: answer }));

    dispatch(submitAndEvaluateAnswer(answer));

    form.resetFields();
  };

  const TOTAL_QUESTIONS = 6;
  const progressPercent = (currentQuestionIndex / TOTAL_QUESTIONS) * 100;

  const showTimer = status === 'in_progress' && currentTimerDuration !== null && !isTyping;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
      <div style={{ padding: '16px', backgroundColor: '#262626' }}>
        <Progress
          percent={progressPercent}
          format={() => `Question ${currentQuestionIndex} of ${TOTAL_QUESTIONS}`}
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          style={{ color: '#fff' }}
          trailColor="#404040"
        />
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map((msg, index) => (
          <MessageComponent key={index} message={msg} />
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {showTimer && <Timer timeLeft={timeLeft} duration={currentTimerDuration as number} />}

      <Form form={form} onFinish={onFinish}>
        <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="input" noStyle rules={[{ required: true, message: 'Please enter your answer' }]}>
                <Input.TextArea
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    placeholder="Type your answer..."
                    autoFocus
                    disabled={isTyping} />
            </Form.Item>
            <Button type="primary" htmlType="submit" disabled={isTyping}>Send</Button>
        </Space.Compact>
      </Form>
    </div>
  );
};

export default ChatWindow;