import React from 'react';
import { Typography, Collapse, Card, Space } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import SubPageLayout from '../components/SubPageLayout';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const GeneralAccessFAQ = () => {
    const faqs = [
        {
            key: '1',
            question: 'What is the Thesis Archive?',
            answer: 'The Thesis Archive is a digital repository of undergraduate and faculty research from our institution. It provides public access to metadata and abstracts to promote academic transparency and reference.'
        },
        {
            key: '2',
            question: 'Is it free to use the archive?',
            answer: 'Yes, searching and viewing public metadata and abstracts is completely free for everyone. No account is required for general browsing.'
        },
        {
            key: '3',
            question: 'Can I download the full text of a thesis?',
            answer: 'Full-text downloads are generally restricted to authorized institutional users. For public users, only abstracts are available. If you need the full text for research, please contact the institution library.'
        },
        {
            key: '4',
            question: 'How often is the archive updated?',
            answer: 'The archive is updated at the end of every academic semester once the final defense versions are approved and processed by the administration.'
        },
        {
            key: '5',
            question: 'Are there any copyright restrictions?',
            answer: 'Yes, all research is protected by copyright. You may cite the research using proper academic formatting, but you cannot redistribute the materials without permission.'
        }
    ];

    return (
        <SubPageLayout 
            title="General Access FAQ" 
            subtitle="Frequently asked questions about browsing and accessing the public archive."
        >
            <Title level={3}><QuestionCircleOutlined /> Common Questions</Title>
            <Paragraph>
                Find answers to the most common questions about how the public archive works and what information is available to visitors.
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

            <Card style={{ borderRadius: 16, background: '#e6f7ff', border: 'none' }}>
                <Space>
                    <InfoCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Paragraph style={{ margin: 0 }}>
                        If your question isn't answered here, please feel free to reach out to the <strong>IT Support</strong> or the <strong>Research Department</strong> using the contact details in the footer.
                    </Paragraph>
                </Space>
            </Card>
        </SubPageLayout>
    );
};

export default GeneralAccessFAQ;
