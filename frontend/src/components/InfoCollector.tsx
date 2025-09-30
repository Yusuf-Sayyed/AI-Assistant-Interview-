        import React, { useMemo } from 'react';
        import { useSelector, useDispatch } from 'react-redux';
        import { Input, Button, Form, Space } from 'antd';
        import { updateCandidateInfo } from '../features/interviewSlice';
        import type { RootState } from '../app/store';

        const InfoCollector: React.FC = () => {
        const dispatch = useDispatch();
        const { candidateInfo } = useSelector((state: RootState) => state.interview);
        const [form] = Form.useForm();

        const missingField = useMemo(() => {
            if (!candidateInfo.name) return 'name';
            if (!candidateInfo.email) return 'email';
            if (!candidateInfo.phone) return 'phone';
            return null;
        }, [candidateInfo]);

        const onFinish = (values: { info: string }) => {
            if (missingField) {
            dispatch(updateCandidateInfo({ [missingField]: values.info }));
            form.resetFields();
            }
        };

        if (!missingField) return null;

        return (
            <div>
            <p>Our resume parser couldn't find your <strong>{missingField}</strong>. Could you please provide it?</p>
            <Form form={form} onFinish={onFinish}>
                <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                    name="info"
                    noStyle
                    rules={[{ required: true, message: `Please enter your ${missingField}` }]}
                >
                    <Input placeholder={`Enter your ${missingField}...`} />
                </Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
                </Space.Compact>
            </Form>
            </div>
        );
        };

        export default InfoCollector;