    import React from 'react';
    import { Progress } from 'antd';

    interface TimerProps {
    timeLeft: number;
    duration: number;
    }

    const Timer: React.FC<TimerProps> = ({ timeLeft, duration }) => {
    const percent = Math.max(0, (timeLeft / duration) * 100);
    const strokeColor = percent > 50 ? '#52c41a' : percent > 25 ? '#faad14' : '#f5222d';

    return (
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <Progress
            percent={percent}
            strokeColor={strokeColor}
            format={() => `${timeLeft}s`}
        />
        </div>
    );
    };

    export default Timer;