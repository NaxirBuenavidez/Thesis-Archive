import React from 'react';
import { Row, Col, Card, Descriptions, Space, Tag, Typography, Badge, Divider } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { BookOpen, Calendar } from 'lucide-react';

const { Title, Text } = Typography;

const tabThesisOverview = ({ thesis, getStatusColor, primaryColor, isMobile, token }) => {
    if (!thesis) return null;
    
    return (
        <div style={{ padding: 24, overflowY: 'auto', height: 'calc(100vh - 110px)' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card size="small" variant="borderless" style={{ background: token.colorFillAlter, borderRadius: 12, height: '100%' }}>
                        <Descriptions layout={isMobile ? "vertical" : "horizontal"} title={<Space><FileTextOutlined style={{ fontSize: 16 }} /> <Text strong>Submission Details</Text></Space>} column={1} size="small" styles={{ label: { color: token.colorTextSecondary } }}>
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(thesis.status)} style={{ borderRadius: 12 }}>{thesis.status.replace('_', ' ').toUpperCase()}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Submission Date">
                                <Space size={4}>
                                    <Calendar size={14} />
                                    <Text>{thesis.submissionDate ? new Date(thesis.submissionDate).toLocaleDateString() : 'N/A'}</Text>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="DOI"><Text>{thesis.raw?.doi || 'N/A'}</Text></Descriptions.Item>
                            <Descriptions.Item label="Visibility">
                                <Badge status={thesis.isConfidential ? "warning" : "success"} text={thesis.isConfidential ? "Confidential" : "Public"} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Degree Type"><Tag color="blue" variant="filled">{thesis.degreeType || 'N/A'}</Tag></Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card size="small" variant="borderless" style={{ background: token.colorFillAlter, borderRadius: 12, height: '100%' }}>
                        <Descriptions layout={isMobile ? "vertical" : "horizontal"} title={<Space><BookOpen size={16} /> <Text strong>Author & Affiliation</Text></Space>} column={1} size="small" styles={{ label: { color: token.colorTextSecondary } }}>
                            <Descriptions.Item label="Main Author"><Text strong>{thesis.author}</Text></Descriptions.Item>
                            <Descriptions.Item label="Program"><Text>{thesis.discipline || 'N/A'}</Text></Descriptions.Item>
                            <Descriptions.Item label="Department"><Text type="secondary">{thesis.department || 'N/A'}</Text></Descriptions.Item>
                            <Descriptions.Item label="Co-Author(s)"><Text>{thesis.raw?.co_author || 'N/A'}</Text></Descriptions.Item>
                            <Descriptions.Item label="Panelists"><Text>{thesis.raw?.panelists || 'N/A'}</Text></Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 12 }}>Research Title</Title>
                <Text strong style={{ fontSize: isMobile ? 16 : 18, color: primaryColor, display: 'block', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {thesis.title}
                </Text>
                {thesis.subtitle && (
                    <Text type="secondary" style={{ fontSize: isMobile ? 13 : 14, display: 'block', marginTop: 4, wordBreak: 'break-word' }}>{thesis.subtitle}</Text>
                )}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 12 }}>Abstract</Title>
                <div style={{ padding: isMobile ? 12 : 16, background: token.colorFillQuaternary, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 8, minHeight: 100 }}>
                    <Text type="secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: isMobile ? 13 : 14, wordBreak: 'break-word' }}>
                        {thesis.abstract || 'No abstract provided for this thesis.'}
                    </Text>
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 12 }}>Index Keywords</Title>
                <Space wrap>
                    {thesis.keywords && thesis.keywords.length > 0 ? (
                        thesis.keywords.map(kw => (
                            <Tag key={kw} style={{ borderRadius: 4, padding: '2px 10px', margin: '4px 0' }}>{kw}</Tag>
                        ))
                    ) : <Text type="secondary" italic>No keywords defined</Text>}
                </Space>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div>
                <Title level={5} style={{ marginBottom: 12 }}>Recommended & Archived By</Title>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <div style={{ background: token.colorFillQuaternary, padding: '12px 16px', borderRadius: 8, marginBottom: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Recommended By</Text>
                            <Text strong>{thesis.raw?.recommended_by || 'N/A'}</Text>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div style={{ background: token.colorFillQuaternary, padding: '12px 16px', borderRadius: 8, marginBottom: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Archived By</Text>
                            <Text strong>{thesis.raw?.archived_by || 'N/A'}</Text>
                        </div>
                    </Col>
                </Row>

                {(() => {
                    const sigEntry = thesis?.raw?.review_checklist?.find(item => typeof item === 'string' && item.startsWith('e_signature:'));
                    const sigImage = sigEntry ? sigEntry.replace('e_signature:', '') : null;
                    if (!sigImage) return null;
                    return (
                        <div style={{ marginTop: 24 }}>
                            <Title level={5} style={{ marginBottom: 12 }}>Authorization Signature</Title>
                            <div style={{ background: '#fff', padding: 16, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 8, display: 'inline-block' }}>
                                <img src={sigImage} alt="E-Signature" style={{ maxHeight: 100, display: 'block' }} />
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default tabThesisOverview;
