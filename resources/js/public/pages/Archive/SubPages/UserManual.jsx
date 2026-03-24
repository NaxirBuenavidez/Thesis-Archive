import React from 'react';
import { Typography, List, Card, Space } from 'antd';
import { CompassOutlined, ControlOutlined, ReadOutlined, NodeIndexOutlined } from '@ant-design/icons';
import SubPageLayout from '../components/SubPageLayout';

const { Title, Paragraph, Text } = Typography;

const UserManual = () => {
    const steps = [
        {
            title: 'Searching for Theses',
            desc: 'Use the global search bar on the home page to find research by titles, keywords, or authors. Just enter your query and press "Search Archive".',
            icon: <CompassOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        },
        {
            title: 'Using Filters',
            desc: 'Refine your results by selecting specific "Research Categories" (Departments). This helps you narrow down to a specific field of study.',
            icon: <ControlOutlined style={{ fontSize: 24, color: '#52c41a' }} />
        },
        {
            title: 'Viewing Thesis Details',
            desc: 'Click on a thesis card to open the preview modal. You can read the abstract, view metadata (authors, year, department), and check keywords.',
            icon: <ReadOutlined style={{ fontSize: 24, color: '#722ed1' }} />
        },
        {
            title: 'Navigating the Archive',
            desc: 'Use the navigation bar to jump between home, search, categories, and guides sections easily on the landing page.',
            icon: <NodeIndexOutlined style={{ fontSize: 24, color: '#faad14' }} />
        }
    ];

    return (
        <SubPageLayout 
            title="User Manual" 
            subtitle="Your comprehensive guide to navigating and using the Thesis Archive system."
        >
            <Title level={3}>Getting Started</Title>
            <Paragraph>
                The Thesis Archive is a digital platform designed to provide easy access to student and faculty research output. 
                Whether you are a student looking for references or a faculty member verifying academic work, this guide will help you.
            </Paragraph>

            <List
                grid={{ gutter: 24, xs: 1, sm: 2 }}
                dataSource={steps}
                renderItem={item => (
                    <List.Item>
                        <Card hoverable style={{ height: '100%', borderRadius: 16 }}>
                            <Space direction="vertical" size="middle">
                                {item.icon}
                                <Title level={4} style={{ margin: 0 }}>{item.title}</Title>
                                <Paragraph type="secondary" style={{ margin: 0 }}>{item.desc}</Paragraph>
                            </Space>
                        </Card>
                    </List.Item>
                )}
            />

            <Title level={3} style={{ marginTop: 40 }}>Advanced Search</Title>
            <Paragraph>
                Our search engine supports keyword matching across all public metadata. You can use specific tags found in the 
                filters section to discover related studies within a particular department.
            </Paragraph>

            <Title level={3}>System Requirements</Title>
            <Paragraph>
                The platform is optimized for modern web browsers including Chrome, Firefox, Safari, and Edge. 
                For the best experience, ensure your browser is up to date and JavaScript is enabled.
            </Paragraph>
        </SubPageLayout>
    );
};

export default UserManual;
