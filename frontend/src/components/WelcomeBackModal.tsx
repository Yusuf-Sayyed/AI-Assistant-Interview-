import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface WelcomeBackModalProps {
    visible: boolean;
    onResume: () => void;
    onRestart: () => void;
}

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({ visible, onResume, onRestart }) => {
    return (
        <Modal
            open={visible}
            closable={false}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center', padding: '24px' }}>
                <Title level={3}>Welcome Back Sir!</Title>
                <Text style={{ display: 'block', marginBottom: '24px' }}>
                    It looks like you have an interview in progress.
                </Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" block size="large" onClick={onResume}>
                        Resume Interview
                    </Button>
                    <Button type="default" block size="large" onClick={onRestart}>
                        Restart
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default WelcomeBackModal;