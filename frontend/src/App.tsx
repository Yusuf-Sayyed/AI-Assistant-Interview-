import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, ConfigProvider, theme } from 'antd';
import { UserOutlined, SolutionOutlined } from '@ant-design/icons';
import IntervieweeView from './pages/IntervieweeView';
import InterviewerDashboard from './pages/InterviewerDashboard';
import WelcomeBackModal from './components/WelcomeBackModal'; // 1. Import the modal
import { resetInterview } from './features/interviewSlice'; // 2. Import reset action
import type { RootState, AppDispatch } from './app/store';
import type { TabsProps } from 'antd'; // Add this import
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const interviewStatus = useSelector((state: RootState) => state.interview.status);
  const [modalVisible, setModalVisible] = useState(false);

  // 3. Check status on initial app load
  useEffect(() => {
    if (interviewStatus === 'in_progress') {
      setModalVisible(true);
    }
  }, [interviewStatus]);

  // 4. Define handlers for the modal buttons
  const handleResume = () => {
    setModalVisible(false);
  };

  const handleRestart = () => {
    dispatch(resetInterview());
    setModalVisible(false);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          Interviewee
        </span>
      ),
      children: <IntervieweeView />,
    },
    {
      key: '2',
      label: (
        <span>
          <SolutionOutlined />
          Interviewer Dashboard
        </span>
      ),
      children: <InterviewerDashboard />,
    },
  ];

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="app-container">
        <div className="content-wrapper">
          <h1 className="main-header">Crisp AI Interview Assistant</h1>
          <Tabs defaultActiveKey="1" items={items} centered />
        </div>
      </div>

      {/* 5. Render the modal */}
      <WelcomeBackModal
        visible={modalVisible}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    </ConfigProvider>
  );
}

export default App;