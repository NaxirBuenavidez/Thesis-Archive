import React from 'react';
import { Typography, Steps, Alert, Card, List } from 'antd';
import { FilePdfOutlined, CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import SubPageLayout from '../components/SubPageLayout';

const { Title, Paragraph, Text } = Typography;

const SubmissionGuide = () => {
    return (
        <SubPageLayout 
            title="Submission Guide" 
            subtitle="Detailed guidelines for preparing and submitting your research to the archive."
        >
            <Alert
                message="Important Requirement"
                description="Only approved defense versions of thesis and dissertations are accepted for archival."
                type="info"
                showIcon
                style={{ marginBottom: 40, borderRadius: 12 }}
            />

            <Title level={3}>Submission Workflow</Title>
            <Steps
                direction="vertical"
                current={0}
                items={[
                    { title: 'Prepare Documentation', description: 'Convert your thesis to the required PDF/A format.' },
                    { title: 'Faculty Review', description: 'Obtain approval from your thesis adviser and department head.' },
                    { title: 'Upload Metadata', description: 'Submit the title, abstract, and author details to the system.' },
                    { title: 'Archive Publication', description: 'The system administrator will review and publish your record.' },
                ]}
                style={{ marginBottom: 40, padding: '0 20px' }}
            />

            <Title level={3}>Document Formatting</Title>
            <List
                dataSource={[
                    { title: 'File Format', content: 'Submissions must be in PDF format. PDF/A is highly recommended for long-term archival.' },
                    { title: 'File Size', content: 'Maximum file size for document uploads is 25MB.' },
                    { title: 'Abstract Length', content: 'Abstracts should be between 250 to 500 words.' },
                    { title: 'Keywords', content: 'Provide at least 3-5 keywords that represent your research topic.' },
                ]}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<FilePdfOutlined style={{ fontSize: 32, color: '#f5222d' }} />}
                            title={<Text strong>{item.title}</Text>}
                            description={item.content}
                        />
                    </List.Item>
                )}
            />

            <Card style={{ marginTop: 40, borderRadius: 16, borderLeft: '6px solid #52c41a' }}>
                <Title level={4}><SafetyCertificateOutlined style={{ color: '#52c41a' }} /> Quality Assurance</Title>
                <Paragraph>
                    All submissions undergo a metadata verification process. Ensure that your spelling, casing, 
                    and author details are accurate before final submission. Incorrect metadata may delay the 
                    publication of your research.
                </Paragraph>
            </Card>

            <Title level={3} style={{ marginTop: 40 }}><CloudUploadOutlined /> Where to Submit?</Title>
            <Paragraph>
                Undergraduate students should coordinate with their respective department coordinators for the 
                submission link. Faculty research is submitted directly through the Admin / Client Portal.
            </Paragraph>
        </SubPageLayout>
    );
};

export default SubmissionGuide;
