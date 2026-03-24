import React from 'react';
import { Typography, Collapse, Card, Space, Tag } from 'antd';
import { UploadOutlined, FileSearchOutlined, CheckCircleOutlined, CloudUploadOutlined, ExperimentOutlined, SafetyOutlined } from '@ant-design/icons';
import SubPageLayout from '../components/SubPageLayout';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const SubmissionFAQ = () => {
    const faqs = [
        {
            key: '1',
            question: 'Who can submit to the archive?',
            answer: 'Submission is open to all students who have successfully defended their thesis and received final approval. Faculty members can also submit their research papers and dissertations.'
        },
        {
            key: '2',
            question: 'What file format is required?',
            answer: 'The system only accepts PDF files. We recommend using the PDF/A standard to ensure long-term readability of your document.'
        },
        {
            key: '3',
            question: 'How long does the approval process take?',
            answer: 'Once submitted, your research will be reviewed by the department coordinator and system administrator. This typically takes 3-5 working days.'
        },
        {
            key: '4',
            question: 'Can I edit my submission after it is published?',
            answer: 'No, once a study is published in the archive, it cannot be edited by the author. If there is a critical error, you must contact the system administrator to request a replacement.'
        },
        {
            key: '5',
            question: 'Is my abstract public immediately?',
            answer: 'No, your abstract and metadata will only become visible to the public after the system administrator has verified and "Publicly Archived" your submission.'
        }
    ];

    return (
        <SubPageLayout 
            title="Submission FAQ" 
            subtitle="Guidance for researchers and students regarding the archive submission process."
        >
            <Title level={3}><CloudUploadOutlined /> Submission Queries</Title>
            <Paragraph>
                Everything you need to know about preparing your research for the digital archive and the lifecycle of a submission.
            </Paragraph>

            <Collapse 
                accordion 
                ghost 
                expandIconPosition="end"
                style={{ marginBottom: 40 }}
            >
                {faqs.map(faq => (
                    <Panel 
                        header={<Text strong style={{ fontSize: 16 }}>{faq.question}</Text>} 
                        key={faq.key}
                        style={{ background: '#f8fafc', borderRadius: 12, marginBottom: 12, border: '1px solid #eef2f6' }}
                    >
                        <Paragraph style={{ margin: 0 }}>{faq.answer}</Paragraph>
                    </Panel>
                ))}
            </Collapse>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <Card style={{ borderRadius: 16, borderTop: '4px solid #1890ff' }}>
                    <Space direction="vertical">
                        <ExperimentOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <Title level={5} style={{ margin: 0 }}>Review Process</Title>
                        <Paragraph style={{ fontSize: 13, color: '#666', margin: 0 }}>Every submission is manually verified to ensure high-quality metadata and proper categorization.</Paragraph>
                        <Tag color="processing">In Review</Tag>
                    </Space>
                </Card>
                <Card style={{ borderRadius: 16, borderTop: '4px solid #52c41a' }}>
                    <Space direction="vertical">
                        <SafetyOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                        <Title level={5} style={{ margin: 0 }}>Final Publication</Title>
                        <Paragraph style={{ fontSize: 13, color: '#666', margin: 0 }}>Once approved, your study will be indexed and searchable by scholars and fellow students.</Paragraph>
                        <Tag color="success">Published</Tag>
                    </Space>
                </Card>
            </div>
        </SubPageLayout>
    );
};

export default SubmissionFAQ;
