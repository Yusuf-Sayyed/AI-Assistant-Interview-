import React from 'react';
import { useDispatch } from 'react-redux';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { setCandidateInfo } from '../features/interviewSlice';
import { parseResume } from '../lib/resumeParser';

const { Dragger } = Upload;

const ResumeUploader: React.FC = () => {
    const dispatch = useDispatch();

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.pdf,.docx',
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                message.loading({ content: 'Parsing resume...', key: 'parsing' });
                const parsedInfo = await parseResume(file as File);
                dispatch(setCandidateInfo(parsedInfo));
                message.success({ content: 'Resume parsed successfully!', key: 'parsing' });
                if (onSuccess) onSuccess('ok');
            } catch (e: any) {
                message.error({ content: e.message || 'Failed to parse resume.', key: 'parsing' });
                if (onError) onError(e);
            }
        },
        showUploadList: false,
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag your Resume here to upload</p>
            <p className="ant-upload-hint">
                Supports PDF and DOCX files.
            </p>
        </Dragger>
    );
};

export default ResumeUploader;