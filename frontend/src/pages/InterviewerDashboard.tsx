    import React, { useState } from 'react';
    import { useSelector } from 'react-redux';
    import { Table, Modal, Typography, Card, Space, Tag, Input, Empty } from 'antd';
    import type { RootState } from '../app/store';
    import type { Candidate } from '../types';

    const { Title, Text } = Typography;
    const { Search } = Input;

    const InterviewerDashboard: React.FC = () => {
    const candidates = useSelector((state: RootState) => state.candidates.candidates) || [];
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const sortedCandidates = Array.isArray(candidates)
        ? [...candidates].sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
        : [];

    const filteredCandidates = sortedCandidates.filter(candidate =>
        candidate.candidateInfo.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.candidateInfo.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
        title: 'Name',
        dataIndex: ['candidateInfo', 'name'],
        key: 'name',
        },
        {
        title: 'Email',
        dataIndex: ['candidateInfo', 'email'],
        key: 'email',
        },
        {
        title: 'Score',
        dataIndex: 'finalScore',
        key: 'score',
        render: (score: number) => `${score}%`,
        sorter: (a: Candidate, b: Candidate) => (a.finalScore || 0) - (b.finalScore || 0),
        },
        {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Candidate) => (
            <a onClick={() => showCandidateDetails(record)}>View Details</a>
        ),
        },
    ];

    const showCandidateDetails = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setIsModalVisible(true);
    };

    const renderChatHistory = (messages: any[]) => (
        <Card title="Chat History" style={{ marginTop: 16 }}>
        {messages.map((message, index) => (
            <div key={index} style={{
            marginBottom: 8,
            textAlign: message.sender === 'user' ? 'right' : 'left',
            }}>
            <Tag color={message.sender === 'user' ? 'blue' : 'green'}>
                {message.sender === 'user' ? 'Candidate' : 'Swipe AI'}
            </Tag>
            <Text>{message.text}</Text>
            </div>
        ))}
        </Card>
    );

    return (
        <div style={{ padding: 24 }}>
        <Title level={2}>Interviewer Dashboard</Title>
        <Search
            placeholder="Search candidates..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
        />
        {filteredCandidates.length > 0 ? (
            <Table
            dataSource={filteredCandidates}
            columns={columns}
            rowKey={(record) => record.id || ''}
            />
        ) : (
            <Empty description="No candidates available yet" style={{ marginTop: 40 }} />
        )}
        <Modal
            title="Candidate Details"
            open={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
            width={800}
        >
            {selectedCandidate && (
            <Space direction="vertical" style={{ width: '100%' }}>
                <Card title="Profile">
                <p><strong>Name:</strong> {selectedCandidate.candidateInfo.name}</p>
                <p><strong>Email:</strong> {selectedCandidate.candidateInfo.email}</p>
                <p><strong>Phone:</strong> {selectedCandidate.candidateInfo.phone}</p>
                </Card>
                <Card title="Interview Results">
                <p><strong>Final Score:</strong> {selectedCandidate.finalScore}%</p>
                <p><strong>Summary:</strong></p>
                <Text>{selectedCandidate.summary}</Text>
                </Card>
                {renderChatHistory(selectedCandidate.messages)}
            </Space>
            )}
        </Modal>
        </div>
    );
    };

    export default InterviewerDashboard;