import React from 'react';
import { Space, Typography, Button } from 'antd';
import { FilePdfOutlined, LinkOutlined } from '@ant-design/icons';

const { Text } = Typography;

const tabThesisFiles = ({ thesis, token }) => {
    if (!thesis) return null;
    
    return (
        <div style={{ height: 'calc(100vh - 110px)', position: 'relative' }}>
            {thesis.raw && thesis.raw.pdf_path ? (
                <div style={{ height: '100%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 12, right: 24, zIndex: 10 }}>
                        <Button
                            icon={<LinkOutlined />}
                            size="small"
                            href={thesis.raw?.pdf_url || `/storage/${thesis.raw.pdf_path}`}
                            target="_blank"
                            type="text"
                            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #ddd' }}
                        >
                            Open Full
                        </Button>
                    </div>
                    <iframe
                        src={thesis.raw?.pdf_url || `/storage/${thesis.raw.pdf_path}`}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                        title="PDF Preview"
                    />
                </div>
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Space direction="vertical" align="center">
                        <FilePdfOutlined style={{ fontSize: 48, color: token.colorTextDisabled }} />
                        <Text type="secondary">No PDF document attached to this thesis.</Text>
                    </Space>
                </div>
            )}
        </div>
    );
};

export default tabThesisFiles;
