import React from 'react';
import { Typography, Card, Space, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, WarningOutlined } from '@ant-design/icons';
import SubPageLayout from '../components/SubPageLayout';

const { Title, Paragraph, Text } = Typography;

const AccountHelp = () => {
    return (
        <SubPageLayout 
            title="Account Help" 
            subtitle="Providing support for student, faculty, and administrative accounts."
        >
            <Alert
                message="Login Notice"
                description="Only institutional members with valid credentials can log in to the management portal. If you are a visitor, you do not need an account."
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 40, borderRadius: 12 }}
            />

            <Title level={3}><UserOutlined /> Managing Your Account</Title>
            <Paragraph>
                Institutional accounts are automatically provisioned. If you are a new student or faculty member, your 
                account details will be provided by your department head or the registrar's office.
            </Paragraph>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
                <Card hoverable style={{ borderRadius: 16 }}>
                    <Space direction="vertical" size="middle">
                        <LockOutlined style={{ fontSize: 28, color: '#ff4d4f' }} />
                        <Title level={4} style={{ margin: 0 }}>Forgotten Password</Title>
                        <Paragraph type="secondary" style={{ margin: 0 }}>
                            If you've forgotten your password, please use the "Forgot Password" link on the login page. 
                            You will need access to your registered institutional email to reset it.
                        </Paragraph>
                    </Space>
                </Card>
                <Card hoverable style={{ borderRadius: 16 }}>
                    <Space direction="vertical" size="middle">
                        <MailOutlined style={{ fontSize: 28, color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>Institutional Email</Title>
                        <Paragraph type="secondary" style={{ margin: 0 }}>
                            Your account is linked to your institutional email. All notifications regarding your research 
                            submissions and password resets will be sent there.
                        </Paragraph>
                    </Space>
                </Card>
            </div>

            <Title level={3}>Troubleshooting Login Issues</Title>
            <Paragraph>If you're having trouble logging in, please check the following:</Paragraph>
            <ul style={{ paddingLeft: 20 }}>
                <li><Text type="secondary">Ensure caps lock is off and you're using the correct email.</Text></li>
                <li><Text type="secondary">Clear your browser cache and cookies, then try again.</Text></li>
                <li><Text type="secondary">If you receive a "Too many login attempts" message, wait for 15 minutes before trying again.</Text></li>
            </ul>

            <Title level={3} style={{ marginTop: 40 }}>Contact Support</Title>
            <Paragraph>
                If you are still unable to access your account after following the steps above, please contact the 
                <strong> System Administrator</strong> or visit the <strong>IT Support Office</strong>. 
                Be ready to provide your institutional ID for verification purposes.
            </Paragraph>
            
            <Space style={{ marginTop: 16 }}>
                <Button type="primary" size="large" style={{ borderRadius: 8 }}>Submit Support Ticket</Button>
                <Button size="large" style={{ borderRadius: 8 }}>View System Status</Button>
            </Space>
        </SubPageLayout>
    );
};

export default AccountHelp;
