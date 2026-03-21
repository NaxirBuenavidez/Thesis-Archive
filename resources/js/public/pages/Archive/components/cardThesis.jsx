import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const cardThesis = ({ item, primaryColor, primaryDark, onClick }) => {
    return (
        <Card 
            hoverable
            className="public-thesis-card"
            onClick={() => onClick(item)}
            style={{ height: '100%', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}
            styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' } }}
            cover={
                <div style={{ height: 140, background: '#edf1f5', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <div style={{ width: '60%', height: 'calc(100% - 20px)', background: '#fff', boxShadow: '0 0 12px rgba(0,0,0,0.1)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, filter: 'blur(3.5px)', opacity: 0.8, transform: 'translateY(20px)', borderRadius: '4px 4px 0 0' }}>
                        <div style={{ height: 8, background: primaryDark, width: '40%', margin: '0 auto 12px auto', opacity: 0.3 }} />
                        <div style={{ height: 4, background: '#cbd5e1', width: '100%' }} />
                        <div style={{ height: 4, background: '#cbd5e1', width: '100%' }} />
                        <div style={{ height: 4, background: '#cbd5e1', width: '90%' }} />
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(248,249,250,0) 0%, rgba(248,249,250,1) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        <LockOutlined /> SHIELDED MANUSCRIPT
                    </div>
                </div>
            }
        >
            <Tag color={primaryColor} style={{ alignSelf: 'flex-start', marginBottom: 12, borderRadius: 4 }}>
                {item.department || 'General'}
            </Tag>
            <Title level={5} style={{ marginTop: 0, marginBottom: 8, lineHeight: 1.4, color: primaryDark }}>
                {item.title}
            </Title>
            <Text type="secondary" style={{ marginBottom: 4, display: 'block' }}>
                By <Text strong>{item.author}</Text>
            </Text>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                Published {dayjs(item.submission_date || item.created_at).format('YYYY')}
            </Text>
            
            {item.doi && (
                <Text style={{ display: 'inline-block', fontSize: 12, background: 'rgba(40,69,214,0.06)', color: primaryColor, padding: '4px 10px', borderRadius: 4, marginBottom: 16, fontWeight: 700 }}>
                    DOI: {item.doi}
                </Text>
            )}

            <Paragraph ellipsis={{ rows: 3 }} type="secondary" style={{ flex: 1, marginBottom: 0, fontSize: 13, lineHeight: 1.6 }}>
                {item.abstract || 'No abstract openly available for this study.'}
            </Paragraph>
            
            <div style={{ marginTop: 16 }}>
                {(item.keywords || []).slice(0, 3).map(k => (
                    <Tag key={k} style={{ border: 0, background: '#f5f5f5', color: '#666', fontSize: 12 }}>{k}</Tag>
                ))}
            </div>
        </Card>
    );
};

export default cardThesis;
