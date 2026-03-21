import React from 'react';
import { Modal, Typography, Row, Col, Card, Tag, Divider, Button, Space } from 'antd';
import { FileProtectOutlined, FileTextOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const ThesisDetailModal = ({ thesis, onClose }) => {
    if (!thesis) return null;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <FileProtectOutlined style={{ color: '#475569', fontSize: 24 }} />
                    </div>
                    <span style={{ color: '#1e293b', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 800 }}>Record Metadata Overview</span>
                </div>
            }
            open={!!thesis}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose} style={{ background: '#334155', borderRadius: 6 }}>Close Record</Button>
            ]}
            width={800}
            centered
        >
            <div style={{ paddingTop: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    <Tag color="blue">{thesis.department || 'Category Unspecified'}</Tag>
                    {thesis.degree_type && <Tag color="cyan">{thesis.degree_type}</Tag>}
                    <Tag color="green">Published Study ID: {thesis.id}</Tag>
                </div>
                
                <Title level={3} style={{ marginTop: 0, marginBottom: 24, lineHeight: 1.3, fontSize: 'clamp(1.2rem, 4vw, 1.75rem)' }}>{thesis.title}</Title>
                
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card size="small" title={<Text strong style={{ color: '#1e293b', fontSize: 15 }}><FileTextOutlined style={{ marginRight: 6 }}/> Abstract Overview</Text>} variant="borderless" style={{ background: '#f8fafc', borderLeft: `4px solid #cbd5e1`, borderRadius: '0 8px 8px 0' }}>
                            <Paragraph style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 0, whiteSpace: 'pre-wrap', color: '#444' }}>
                                {thesis.abstract || 'No abstract is publicly available for this document.'}
                            </Paragraph>
                        </Card>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>Primary Author</Text>
                        <Text strong style={{ fontSize: 18, color: '#222' }}>{thesis.author}</Text>
                    </Col>

                    {thesis.co_author && (
                        <Col xs={24} sm={12}>
                            <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>Co-Authors</Text>
                            <Text strong style={{ fontSize: 18, color: '#222' }}>{thesis.co_author}</Text>
                        </Col>
                    )}

                    <Col xs={24} sm={12}>
                        <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>Institution & Year</Text>
                        <Text strong style={{ fontSize: 18, color: '#222' }}>{thesis.institution || 'Institutional Record'} <span style={{ opacity: 0.5, margin: '0 8px' }}>•</span> {dayjs(thesis.submission_date || thesis.created_at).format('YYYY')}</Text>
                    </Col>
                    
                    {thesis.doi && (
                        <Col xs={24} sm={12}>
                            <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>DOI Reference</Text>
                            <Text strong style={{ fontSize: 18, color: '#222' }}>{thesis.doi}</Text>
                        </Col>
                    )}

                    <Col span={24}>
                        <Text style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 12 }}>Indexed Keywords</Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(thesis.keywords || []).map(k => (
                                <Tag key={k} color="#94a3b8" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 4, fontWeight: 600 }}>{k}</Tag>
                            ))}
                            {(!thesis.keywords || thesis.keywords.length === 0) && <Text type="secondary">N/A</Text>}
                        </div>
                    </Col>
                </Row>

                <Divider />
                
                <div style={{ textAlign: 'center', padding: 'clamp(24px, 5vw, 32px) clamp(16px, 4vw, 24px)', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                    <LockOutlined style={{ fontSize: 40, color: '#64748b', marginBottom: 16 }} />
                    <Title level={4} style={{ color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Confidential Resource</Title>
                    <Text style={{ color: '#475569', fontSize: 15, display: 'block', marginBottom: 24, maxWidth: 600, margin: '0 auto 24px auto' }}>
                        The full manuscript, raw methodology, and dataset results are strictly shielded for internal use. Access is restricted to authorized clients securely connected to the Intranet Portal.
                    </Text>
                    <Link to="/login">
                        <Button type="primary" size="large" style={{ background: '#334155', borderRadius: 8, fontWeight: 800, padding: '0 32px', height: 48, fontSize: 15 }}>
                            See more... Login to Portal
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export default ThesisDetailModal;
