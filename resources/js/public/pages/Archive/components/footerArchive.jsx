import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { HomeOutlined, MailOutlined, PhoneOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text: AntText, Paragraph } = Typography;

const footerArchive = React.memo(({ logoPath, primaryColor, primaryDark, appName }) => {
    return (
        <Footer style={{ background: '#141414', color: '#fff', padding: '60px 5% 40px', borderTop: `1px solid rgba(255,255,255,0.1)`, position: 'relative', zIndex: 1 }}>
            <Row gutter={[48, 32]}>
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="https://pecit.edu.ph/" target="_blank" rel="noopener noreferrer">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                    <img src="/images/pecit-mono-logo.png" alt="PECIT Logo" style={{ height: 100, objectFit: 'contain' }} />
                                    <AntText strong style={{ color: '#fff', fontSize: 14, lineHeight: 1.2 }}>PECIT</AntText>
                                </div>
                            </a>
                            <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.2)', opacity: 0.5 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <img src="/images/ptas.png" alt="PTAS Logo" style={{ height: 100, objectFit: 'contain' }} />
                                <AntText strong style={{ color: '#fff', fontSize: 14, lineHeight: 1.2 }}>PTAS</AntText>
                            </div>
                        </div>
                    </div>
                </Col>
                
                <Col xs={24} md={6} id="footer-guides">
                    <Title level={5} style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Manual & Guides</Title>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><InfoCircleOutlined style={{ fontSize: 14 }} /> User Manual</a></li>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><InfoCircleOutlined style={{ fontSize: 14 }} /> Research Policy</a></li>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><InfoCircleOutlined style={{ fontSize: 14 }} /> Submission Guide</a></li>
                    </ul>
                    <Title level={5} style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 24, marginBottom: 16 }}>Terms & Privacy</Title>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Terms of Use and Conditions</a></li>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Data Privacy Policy</a></li>
                    </ul>
                </Col>
                
                <Col xs={24} md={5} id="footer-faq">
                    <Title level={5} style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Frequently Asked Questions</Title>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><QuestionCircleOutlined style={{ fontSize: 14 }} /> General Access FAQ</a></li>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><QuestionCircleOutlined style={{ fontSize: 14 }} /> Submission FAQ</a></li>
                        <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><QuestionCircleOutlined style={{ fontSize: 14 }} /> Account Help</a></li>
                    </ul>
                    <div style={{ marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                        <AntText strong style={{ color: '#fff', display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, marginBottom: 4 }}>
                            <HomeOutlined style={{ marginTop: 2 }} /> Institution Address
                        </AntText>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                            Capitol-Bonbon Road, Imadejas Subd., Butuan City, PH
                        </Paragraph>
                    </div>
                </Col>
                
                <Col xs={24} md={5}>
                    <Title level={5} style={{ color: '#fff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>FOR INQUIRIES</Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                        <div>
                            <AntText style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                <PhoneOutlined /> COLLEGE
                            </AntText>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, paddingLeft: 22 }}>
                                (+63) 92704-95730 or<br/>
                                (+63) 95138-70989
                            </Paragraph>
                        </div>
                        <div>
                            <AntText style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                <PhoneOutlined /> TESDA
                            </AntText>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, paddingLeft: 22 }}>
                                (+63) 96391-58460 or<br/>
                                (+63) 92704-95730
                            </Paragraph>
                        </div>
                        <div>
                            <AntText style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                                <PhoneOutlined /> BASIC EDUCATION
                            </AntText>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, paddingLeft: 22 }}>
                                (+63) 93868-50231
                            </Paragraph>
                        </div>
                    </div>
                </Col>
            </Row>
        </Footer>
    );
});

export default footerArchive;
