import React from 'react';
import { Typography, Card, Table, Tag } from 'antd';
import { SafetyCertificateOutlined, LockOutlined, EyeOutlined } from '@ant-design/icons';
import SubPageLayout from '../components/SubPageLayout';

const { Title, Paragraph, Text } = Typography;

const ResearchPolicy = () => {
    const dataUsage = [
        { key: '1', purpose: 'Academic Reference', access: 'Public', description: 'Metadata and abstracts are available for academic citation.' },
        { key: '2', purpose: 'Verification', access: 'Institutional', description: 'Faculty may verify the authenticity of submitted research.' },
        { key: '3', purpose: 'System Optimization', access: 'Internal', description: 'Anonymized usage data to improve search relevance.' },
    ];

    const columns = [
        { title: 'Purpose', dataIndex: 'purpose', key: 'purpose', render: text => <Text strong>{text}</Text> },
        { title: 'Access Level', dataIndex: 'access', key: 'access', render: level => <Tag color={level === 'Public' ? 'blue' : 'gold'}>{level}</Tag> },
        { title: 'Description', dataIndex: 'description', key: 'description' },
    ];

    return (
        <SubPageLayout 
            title="Research Policy" 
            subtitle="Policies governing intellectual property and data usage in our archive."
        >
            <Title level={3}><SafetyCertificateOutlined /> Intellectual Property Rules</Title>
            <Paragraph>
                All research materials in this archive are protected by copyright law. Users are permitted to read 
                abstracts and cite metadata for academic purposes. Reproduction or distribution of full texts 
                without explicit permission from the authors and the institution is strictly prohibited.
            </Paragraph>

            <Title level={3}><LockOutlined /> Data Privacy (RA 10173)</Title>
            <Paragraph>
                In compliance with the <strong>National Privacy Commission (NPC)</strong> and the <strong>Data Privacy Act of 2012 (RA 10173)</strong>, 
                we ensure that all personal information of authors and faculty is handled with strict confidentiality.
            </Paragraph>

            <Card style={{ borderRadius: 16, background: '#f0f5ff', border: 'none', marginBottom: 40 }}>
                <Title level={4}>Data Handling Commitment</Title>
                <Paragraph>
                    This digital archive serves the student and faculty research output of our institution. 
                    Personal data is used solely for academic referencing and system administration.
                </Paragraph>
            </Card>

            <Title level={3}><EyeOutlined /> Usage & Access Guidelines</Title>
            <Table 
                dataSource={dataUsage} 
                columns={columns} 
                pagination={false} 
                style={{ marginBottom: 40 }}
                onHeaderRow={() => ({ style: { background: '#fafafa' } })}
            />

            <Title level={4}>Citation Policy</Title>
            <Paragraph>
                When citing research from this archive, please use the standard APA or MLA format as required by your 
                department. Ensure the name of the institution and the archive URL are included in the citation.
            </Paragraph>
        </SubPageLayout>
    );
};

export default ResearchPolicy;
