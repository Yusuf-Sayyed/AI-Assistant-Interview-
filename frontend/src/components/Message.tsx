import React from 'react';
import { Avatar, Card } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import type { Message } from '../types';

interface MessageProps {
    message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
    const isAI = message.sender === 'ai';

    const cardStyle: React.CSSProperties = {
        marginBottom: '16px',
        maxWidth: '80%',
        alignSelf: isAI ? 'flex-start' : 'flex-end',
        background: isAI ? '#374151' : '#3B82F6',
        color: '#F9FAFB',
        borderRadius: isAI ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
        border: 'none',
    };

    return (
        <div style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end', gap: '12px', alignItems: 'flex-start' }}>
            {isAI && <Avatar style={{ background: '#4B5563' }} icon={<RobotOutlined />} />}
            <Card styles={{ body: { padding: '12px 16px', whiteSpace: 'pre-wrap' } }} style={cardStyle}>
                {message.text}
            </Card>
            {!isAI && <Avatar style={{ background: '#1D4ED8' }} icon={<UserOutlined />} />}
        </div>
    );
};

export default MessageComponent;