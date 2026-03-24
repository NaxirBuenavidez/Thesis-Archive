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

            <Title level={3}><FileProtectOutlined /> Data Privacy (RA 10173)</Title>
            <Paragraph>
                In compliance with the <strong>National Privacy Commission (NPC)</strong> and the <strong>Data Privacy Act of 2012 (RA 10173)</strong>, 
                we ensure that all personal information of authors and faculty is handled with strict confidentiality.
            </Paragraph>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
                <Card title="Data Subject Rights" bordered={false} style={{ background: '#f6ffed', borderRadius: 16 }}>
                    <ul style={{ paddingLeft: 20 }}>
                        <li><Text strong>Right to be Informed</Text>: Clear notices on data collection.</li>
                        <li><Text strong>Right to Access</Text>: Authors can view their archived records.</li>
                        <li><Text strong>Right to Object</Text>: Control over public visibility of research.</li>
                        <li><Text strong>Right to Erasure</Text>: Process for removing outdated data.</li>
                    </ul>
                </Card>
                <Card title="Security Measures" bordered={false} style={{ background: '#fff7e6', borderRadius: 16 }}>
                    <ul style={{ paddingLeft: 20 }}>
                        <li><Text strong>Organizational</Text>: Strict internal access protocols.</li>
                        <li><Text strong>Physical</Text>: Secure server environment (Cloud-based).</li>
                        <li><Text strong>Technical</Text>: Data encryption & session security.</li>
                    </ul>
                </Card>
            </div>

            <Title level={4}>Data Retention & Disposal</Title>
            <Paragraph>
                Research records are maintained as part of the institution's permanent academic history. 
                However, personal identifiers of graduated students are periodically reviewed. 
                De-identified data may be kept indefinitely for longitudinal research analysis.
            </Paragraph>

            <Title level={3}><AuditOutlined /> Usage & Access Guidelines</Title>
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
