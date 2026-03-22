import React from 'react';
import { Modal, Typography, Row, Col, Card, Tag, Divider, Button, Grid } from 'antd';
import { FileProtectOutlined, FileTextOutlined, LockOutlined, GlobalOutlined, UserOutlined, CalendarOutlined, LinkOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text: AntText, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const modalThesis = ({ thesis, onClose, primaryColor, primaryDark }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    if (!thesis) return null;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
                    <div style={{ background: `${primaryColor}10`, padding: isMobile ? '6px 10px' : '8px 12px', borderRadius: 8, border: `1px solid ${primaryColor}20`, flexShrink: 0 }}>
                        <FileProtectOutlined style={{ color: primaryColor, fontSize: isMobile ? 20 : 24 }} />
                    </div>
                    <span style={{ color: '#1e293b', fontSize: 'clamp(1rem, 4vw, 1.4rem)', fontWeight: 800, lineHeight: 1.2 }}>
                        {isMobile ? 'Record Details' : 'Record Metadata Overview'}
                    </span>
                </div>
            }
            open={!!thesis}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose} style={{ background: primaryDark, borderRadius: 6, width: isMobile ? '100%' : 'auto', height: 40, fontWeight: 600 }}>
                    Close Record
                </Button>
            ]}
            width={isMobile ? '95%' : 850}
            centered
            bodyStyle={{ padding: isMobile ? '12px 16px' : '24px 32px', maxHeight: '75vh', overflowY: 'auto' }}
        >
            <div style={{ paddingTop: isMobile ? 8 : 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    <Tag color="blue" style={{ margin: 0, borderRadius: 4, fontWeight: 500 }}>{thesis.department || 'Category Unspecified'}</Tag>
                    {thesis.degree_type && <Tag color="cyan" style={{ margin: 0, borderRadius: 4, fontWeight: 500 }}>{thesis.degree_type}</Tag>}
                </div>
                
                <Title level={3} style={{ 
                    marginTop: 0, 
                    marginBottom: 28, 
                    lineHeight: 1.3, 
                    fontSize: 'clamp(1.25rem, 5vw, 1.85rem)',
                    color: '#0f172a',
                    fontWeight: 800
                }}>
                    {thesis.title}
                </Title>
                
                <Row gutter={[24, 32]}>
                    <Col span={24}>
                        <Card 
                            size="small" 
                            title={
                                <AntText strong style={{ color: primaryDark, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FileTextOutlined /> Abstract Overview
                                </AntText>
                            } 
                            styles={{ body: { padding: isMobile ? '16px' : '24px' } }}
                            style={{ 
                                background: '#f8fafc', 
                                borderLeft: `5px solid ${primaryColor}`, 
                                borderRadius: '4px 12px 12px 4px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                border: '1px solid #f1f5f9'
                            }}
                        >
                            <Paragraph style={{ 
                                fontSize: isMobile ? 14 : 15, 
                                lineHeight: 1.8, 
                                marginBottom: 0, 
                                whiteSpace: 'pre-wrap', 
                                color: '#334155' 
                            }}>
                                {thesis.abstract || 'No abstract is publicly available for this document.'}
                            </Paragraph>
                        </Card>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <div style={{ padding: '16px', background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', height: '100%' }}>
                            <AntText style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#64748b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                <UserOutlined style={{ color: primaryColor }} /> Primary Author
                            </AntText>
                            <AntText strong style={{ fontSize: isMobile ? 16 : 18, color: '#1e293b', display: 'block' }}>
                                {thesis.author}
                            </AntText>
                        </div>
                    </Col>

                    {thesis.co_author && (
                        <Col xs={24} sm={12}>
                            <div style={{ padding: '16px', background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', height: '100%' }}>
                                <AntText style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#64748b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <UserOutlined style={{ color: primaryColor }} /> Co-Authors
                                </AntText>
                                <AntText strong style={{ fontSize: isMobile ? 16 : 18, color: '#1e293b', display: 'block' }}>
                                    {thesis.co_author}
                                </AntText>
                            </div>
                        </Col>
                    )}

                    <Col xs={24} sm={12}>
                        <div style={{ padding: '16px', background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', height: '100%' }}>
                            <AntText style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#64748b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                <GlobalOutlined style={{ color: primaryColor }} /> Institution & Year
                            </AntText>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AntText strong style={{ fontSize: isMobile ? 16 : 18, color: '#1e293b' }}>
                                    {thesis.institution || 'Institutional Record'}
                                </AntText>
                                <AntText style={{ opacity: 0.3, fontSize: 18 }}>|</AntText>
                                <AntText strong style={{ fontSize: isMobile ? 16 : 18, color: primaryColor }}>
                                    {dayjs(thesis.submission_date || thesis.created_at).format('YYYY')}
                                </AntText>
                            </div>
                        </div>
                    </Col>
                    
                    {thesis.doi && (
                        <Col xs={24} sm={12}>
                            <div style={{ padding: '16px', background: `${primaryColor}05`, borderRadius: 12, border: `1px dashed ${primaryColor}30`, height: '100%' }}>
                                <AntText style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: primaryColor, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <LinkOutlined /> DOI Reference
                                </AntText>
                                <AntText strong style={{ fontSize: isMobile ? 15 : 16, color: '#1e293b', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                                    {thesis.doi}
                                </AntText>
                            </div>
                        </Col>
                    )}

                    <Col span={24}>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
                            <AntText style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8', fontWeight: 800, marginBottom: 16 }}>
                                Indexed Keywords
                            </AntText>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {(thesis.keywords || []).map(k => (
                                    <Tag key={k} style={{ 
                                        fontSize: 12, 
                                        padding: '4px 12px', 
                                        borderRadius: 6, 
                                        fontWeight: 600, 
                                        color: '#475569',
                                        background: '#f1f5f9',
                                        border: '1px solid #e2e8f0',
                                        margin: 0
                                    }}>
                                        {k}
                                    </Tag>
                                ))}
                                {(!thesis.keywords || thesis.keywords.length === 0) && <AntText type="secondary" style={{ fontSize: 14 }}>N/A</AntText>}
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: '32px 0' }} />
                
                <div style={{ 
                    textAlign: 'center', 
                    padding: isMobile ? '32px 20px' : '40px 32px', 
                    background: `linear-gradient(135deg, ${primaryColor}08 0%, #f8fafc 100%)`, 
                    borderRadius: 20, 
                    border: `1px solid ${primaryColor}15`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ 
                        width: 64, 
                        height: 64, 
                        background: '#fff', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
                    }}>
                        <LockOutlined style={{ fontSize: 32, color: primaryColor }} />
                    </div>
                    <Title level={4} style={{ color: '#0f172a', margin: '0 0 12px 0', fontWeight: 800, fontSize: isMobile ? 18 : 22 }}>
                        Confidential Resource
                    </Title>
                    <AntText style={{ color: '#64748b', fontSize: isMobile ? 14 : 16, display: 'block', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px auto', lineHeight: 1.7 }}>
                        The full manuscript, raw methodology, and dataset results are strictly shielded for internal use. Access is restricted to authorized clients securely connected to the Intranet Portal.
                    </AntText>
                    <Link to="/login" style={{ display: isMobile ? 'block' : 'inline-block', width: '100%' }}>
                        <Button type="primary" size="large" style={{ 
                            background: primaryDark, 
                            borderRadius: 10, 
                            fontWeight: 800, 
                            padding: '0 40px', 
                            height: 54, 
                            fontSize: 16,
                            width: isMobile ? '100%' : 'auto',
                            boxShadow: `0 8px 20px ${primaryColor}40`
                        }}>
                            See more... Login to Portal
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export default modalThesis;
