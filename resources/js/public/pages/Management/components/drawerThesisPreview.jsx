import React from 'react';
import { Drawer, Typography, Tabs, theme } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import tabThesisOverview from './tabThesisOverview';
import tabThesisFiles from './tabThesisFiles';

const { Text } = Typography;

const drawerThesisPreview = ({ 
    open, 
    onClose, 
    thesis, 
    isMobile, 
    getStatusColor, 
    primaryColor,
    token 
}) => {
    const OverviewTab = tabThesisOverview;
    const FilesTab = tabThesisFiles;

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                    <div>
                        <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.2 }}>Document Preview</Text>
                        <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>Review research details and attached document</Text>
                    </div>
                </div>
            }
            placement={isMobile ? 'bottom' : 'right'}
            onClose={onClose}
            open={open}
            size={isMobile ? 'default' : 'large'}
            styles={{
                wrapper: isMobile ? { height: '90vh' } : undefined,
                header: { borderBottom: `1px solid ${token.colorBorderSecondary}`, padding: '16px 24px' },
                body: { padding: 0 }
            }}
        >
            {thesis ? (
                <Tabs
                    defaultActiveKey="1"
                    style={{ height: '100%' }}
                    tabBarStyle={{ padding: '0 24px', margin: 0, background: token.colorBgContainer }}
                    items={[
                        {
                            key: '1',
                            label: 'Overview',
                            children: <OverviewTab thesis={thesis} getStatusColor={getStatusColor} primaryColor={primaryColor} isMobile={isMobile} token={token} />
                        },
                        {
                            key: '2',
                            label: 'Full Document (PDF)',
                            children: <FilesTab thesis={thesis} token={token} />
                        }
                    ]}
                />
            ) : null}
        </Drawer>
    );
};

export default drawerThesisPreview;
